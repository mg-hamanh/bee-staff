import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function markEmail(email: string): string {
    if (!email || typeof email !== 'string') {
    return '';
  }

  // Tách tên người dùng và tên miền
  const [username, domain] = email.split('@');

  // Nếu không có tên miền, trả về chuỗi rỗng
  if (!domain) {
    return '';
  }

  // Xử lý tên người dùng
  let maskedUsername;
  if (username.length <= 1) {
    maskedUsername = username;
  } else {
    maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  }

  // Xử lý tên miền
  const [domainName, ...domainExtensions] = domain.split('.');
  const maskedDomainName = domainName.charAt(0) + '*'.repeat(domainName.length - 2) + domainName.charAt(domainName.length - 1);
  const maskedDomain = [maskedDomainName, ...domainExtensions].join('.');

  return `${maskedUsername}@${maskedDomain}`;
}