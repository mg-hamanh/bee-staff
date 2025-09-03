import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // prisma client của bạn
import { UserSchema } from "@/types/type-zod";
import { requireAdmin, requireAuth } from "@/lib/auth/guard";
import { Prisma, Role } from "@prisma/client";


export async function GET(req: NextRequest) {
  try {
    const { error, session, depotFilter } = await requireAuth(req, {
      roles: ["leader"],       // seller/cashier không được xem list user
      restrictByDepot: true,   // leader chỉ được xem theo depot
    });

    if (error) return error;

    const { searchParams } = new URL(req.url);

    const pageIndex = parseInt(searchParams.get('pageIndex') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '25');

    const sortParam = searchParams.get('sort') || 'createdAt desc';
    const [sortField, sortOrder] = sortParam.split(' ');
    const orderBy = { [sortField]: sortOrder };
    
    
    let baseWhere: Prisma.UserWhereInput = {};
    if (session!.user.isAdmin) {
      baseWhere = {};
    } else if (session!.user.role === "leader") {
      baseWhere = {
        depots: { hasSome: depotFilter },
        isAdmin: false,
      };
    } else {
      return NextResponse.json({ 
        total: 0, 
        data: [], 
        filter: 0, 
        pagination: { pageCount: 0, total: 0, pageIndex: 0, pageSize: 0 } 
      });
    }

    const filterConditions = [];
    const activeFilters = [];
    // Lặp qua tất cả các params để tìm filter
    for (const [key, value] of searchParams.entries()) {
      if (['pageIndex', 'pageSize', 'sort'].includes(key)) continue;
      activeFilters.push({ id: key, value: value });
      if (key === 'name' || key === 'username') {
        filterConditions.push({
          OR: [
            { name: { contains: value, mode: Prisma.QueryMode.insensitive  } },
            { username: { contains: value, mode: Prisma.QueryMode.insensitive } }
          ]
        });
      } else if (key === 'role') {
        const roles = value.split(',');
        const validRoles = roles as Role[];

        if (validRoles.length > 0) {
          filterConditions.push({role: { in: validRoles }});
        }
      } else if (key === 'depots') {
        filterConditions.push({ depots: { hasSome: value.split(',').map(Number) } });
      } else if (key === 'isActive') {
        const boolValues = value.split(',').map(v => v === 'true');
        if (boolValues.length === 1) {
          filterConditions.push({ isActive: boolValues[0] });
        }
      }
       
      // -> Anh có thể thêm các điều kiện else if khác cho các bảng khác ở đây
    }


    const where = { ...baseWhere, AND: filterConditions };

    // --- Thực hiện truy vấn ---
    const [users, totalFiltered, totalAll] = await prisma.$transaction([
      prisma.user.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        where,
        orderBy,
        include: {
          accounts: true,
          sessions: true,
          payRateTemplate: {
            include: {
              bonusTemplates: {
                include: {
                  bonusLevels: true,
                }
              }
            }
          }
        },
      }),
      prisma.user.count({ where }),
      prisma.user.count({ where: baseWhere }),
    ]);

    const pageCount = Math.ceil(totalFiltered / pageSize);

    return NextResponse.json({
      total: totalAll,
      data: users,
      filter: activeFilters,
      pagination: {
        pageCount,
        total: totalFiltered,
        pageIndex,
        pageSize,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}



export async function POST(req: NextRequest) {
  // ✅ chỉ cho admin
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = UserSchema.parse(body);

    const newUser = await prisma.user.create({
      data: {
        username: parsed.username,
        name: parsed.name || "",
        email: parsed.email,
        mobile: parsed.mobile,
        depots: parsed.depots || [],
        image: parsed.image,
        role: parsed.role,
        isActive: parsed.isActive,
        payRateId: body.payRateId || null,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
