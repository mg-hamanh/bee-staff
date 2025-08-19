"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Settings, Users, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Level {
  id: number
  unit: string
  bonus: number
  level: number
  amount: number
}

interface Template {
  id: string
  name: string
  status: number
  levels: Level[]
  total_users: number
  users: User[]
}

interface User {
  id: string
  full_name: string
  pay_rate_id?: string
  email?: string
  employee_id?: string
  department?: string
}

export default function AdminSettings() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    user: User | null
    message: string
  }>({ open: false, user: null, message: "" })
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [selectedNewUser, setSelectedNewUser] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://n8n.beeshoes.com.vn/webhook/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(Array.isArray(data) ? data : [data])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://n8n.beeshoes.com.vn/webhook/pay-rate-template")
      if (response.ok) {
        const data = await response.json()
        setTemplates(Array.isArray(data) ? data : [data])
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageUsers = async (template: Template) => {
    setSelectedTemplate(template)
    await fetchUsers()
    const templateUserIds = template.users?.map((u) => u.id) || []
    setAvailableUsers(users.filter((user) => !templateUserIds.includes(user.id)))
    setIsUserDialogOpen(true)
  }

  const handleUserToggle = (userId: string, checked: boolean) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    if (checked) {
      if (user.pay_rate_id && user.pay_rate_id !== selectedTemplate?.id) {
        setConfirmDialog({
          open: true,
          user,
          message: `User ${user.full_name} is already assigned to another template. Do you want to change their assignment?`,
        })
      } else {
        setSelectedUsers((prev) => [...prev, userId])
      }
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
    }
  }

  const confirmUserChange = () => {
    if (confirmDialog.user && selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        users: [...(selectedTemplate.users || []), confirmDialog.user],
        total_users: (selectedTemplate.total_users || 0) + 1,
      }
      setSelectedTemplate(updatedTemplate)
      setAvailableUsers((prev) => prev.filter((u) => u.id !== confirmDialog.user!.id))
      setSelectedNewUser("")
    }
    setConfirmDialog({ open: false, user: null, message: "" })
  }

  const saveTemplate = async (template: Template) => {
    try {
      const response = await fetch("https://n8n.beeshoes.com.vn/webhook/pay-rate-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      })

      if (response.ok) {
        await fetchTemplates()
        setIsDialogOpen(false)
        setEditingTemplate(null)
      }
    } catch (error) {
      console.error("Error saving template:", error)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        const template = templates.find((t) => t.id === id)
        if (template) {
          await saveTemplate({ ...template, status: 0 })
        }
      } catch (error) {
        console.error("Error deleting template:", error)
      }
    }
  }

  const handleCreateNew = () => {
    setEditingTemplate({
      id: "",
      name: "",
      status: 1,
      levels: [{ id: 1, unit: "percent", bonus: 1, level: 1, amount: 0 }],
      total_users: 0,
      users: [],
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate({ ...template })
    setIsDialogOpen(true)
  }

  const addLevel = () => {
    if (editingTemplate) {
      const newLevel: Level = {
        id: editingTemplate.levels.length + 1,
        unit: "percent",
        bonus: 1,
        level: editingTemplate.levels.length + 1,
        amount: 0,
      }
      setEditingTemplate({
        ...editingTemplate,
        levels: [...editingTemplate.levels, newLevel],
      })
    }
  }

  const removeLevel = (levelId: number) => {
    if (editingTemplate && editingTemplate.levels.length > 1) {
      setEditingTemplate({
        ...editingTemplate,
        levels: editingTemplate.levels.filter((l) => l.id !== levelId),
      })
    }
  }

  const updateLevel = (levelId: number, field: keyof Level, value: any) => {
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        levels: editingTemplate.levels.map((l) => (l.id === levelId ? { ...l, [field]: value } : l)),
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleAddUser = () => {
    if (!selectedNewUser || !selectedTemplate) return

    const userToAdd = availableUsers.find((u) => u.id === selectedNewUser)
    if (!userToAdd) return

    if (userToAdd.pay_rate_id && userToAdd.pay_rate_id !== selectedTemplate.id) {
      setConfirmDialog({
        open: true,
        user: userToAdd,
        message: `Nhân viên ${userToAdd.full_name} đã được thiết lập mẫu lương ${userToAdd.pay_rate_id}. Bạn có chắc chắn thay thế bằng mẫu lương ${selectedTemplate.name}?`,
      })
    } else {
      const updatedTemplate = {
        ...selectedTemplate,
        users: [...(selectedTemplate.users || []), userToAdd],
        total_users: (selectedTemplate.total_users || 0) + 1,
      }
      setSelectedTemplate(updatedTemplate)
      setAvailableUsers((prev) => prev.filter((u) => u.id !== selectedNewUser))
      setSelectedNewUser("")
    }
  }

  const handleRemoveUser = (userId: string) => {
    if (!selectedTemplate) return

    const userToRemove = selectedTemplate.users?.find((u) => u.id === userId)
    if (!userToRemove) return

    const updatedTemplate = {
      ...selectedTemplate,
      users: selectedTemplate.users?.filter((u) => u.id !== userId) || [],
      total_users: Math.max(0, (selectedTemplate.total_users || 0) - 1),
    }
    setSelectedTemplate(updatedTemplate)
    setAvailableUsers((prev) => [...prev, userToRemove])
  }

  const saveUserAssignments = async () => {
    try {
      if (selectedTemplate) {
        await saveTemplate(selectedTemplate)
      }
      setIsUserDialogOpen(false)
      await fetchTemplates()
    } catch (error) {
      console.error("Error saving user assignments:", error)
    }
  }

  useEffect(() => {
    fetchUsers().then(() => fetchTemplates())
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading templates...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Target Templates Settings</h2>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Pay Rate Templates</h3>
        </div>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Template Name</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Levels</TableHead>
              <TableHead className="font-semibold text-center">Total Users</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates
              .filter((t) => t.status === 1)
              .map((template) => (
                <TableRow key={template.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant={template.status === 1 ? "default" : "secondary"}>
                      {template.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 max-w-xs">
                      {template.levels.map((level) => (
                        <div key={level.id} className="text-sm bg-gray-100 px-2 py-1 rounded">
                          Level {level.level}: {formatCurrency(level.amount)} ({level.bonus}%)
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManageUsers(template)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      {template.total_users || 0}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                        className="hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate?.id ? "Edit Template" : "Create New Template"}</DialogTitle>
          </DialogHeader>

          {editingTemplate && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Mẫu áp dụng
                  </Label>
                  <Input
                    id="name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="Nhập tên mẫu"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <h3 className="font-medium">Thưởng</h3>
                    <p className="text-sm text-muted-foreground">Thiết lập thưởng theo doanh thu cho nhân viên</p>
                  </div>
                  <Switch
                    checked={editingTemplate.status === 1}
                    onCheckedChange={(checked) => setEditingTemplate({ ...editingTemplate, status: checked ? 1 : 0 })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Loại thưởng</Label>
                    <Select defaultValue="individual">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn loại thưởng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Theo doanh thu cá nhân</SelectItem>
                        <SelectItem value="team">Theo doanh thu nhóm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Hình thức</Label>
                    <Select defaultValue="total">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn hình thức" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Tính theo mức tổng doanh thu</SelectItem>
                        <SelectItem value="incremental">Tính theo mức tăng doanh thu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-medium">Loại hình</TableHead>
                      <TableHead className="font-medium">Doanh thu</TableHead>
                      <TableHead className="font-medium">Thưởng</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editingTemplate.levels.map((level, index) => (
                      <TableRow key={level.id}>
                        <TableCell>
                          <Select defaultValue="consultant">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultant">Tư vấn bán hàng</SelectItem>
                              <SelectItem value="manager">Quản lý</SelectItem>
                              <SelectItem value="director">Giám đốc</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Từ</span>
                            <Input
                              type="text"
                              value={level.amount.toLocaleString("vi-VN")}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, "")
                                updateLevel(level.id, "amount", Number(value))
                              }}
                              className="w-32"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="text"
                              value={level.bonus}
                              onChange={(e) => updateLevel(level.id, "bonus", e.target.value)}
                              className="w-20"
                            />
                            <span className="text-sm">% Doanh thu</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingTemplate.levels.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLevel(level.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="p-4 border-t">
                  <Button
                    variant="link"
                    onClick={addLevel}
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
                  >
                    Thêm thưởng
                  </Button>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setEditingTemplate(null)
                  }}
                >
                  Xóa
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingTemplate(null)
                    }}
                  >
                    Bỏ qua
                  </Button>
                  <Button onClick={() => saveTemplate(editingTemplate)} className="bg-blue-600 hover:bg-blue-700">
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nhân viên áp dụng - {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Select users to assign to this template. Users with existing templates will show a confirmation dialog.
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-16">STT</TableHead>
                    <TableHead>Tên nhân viên</TableHead>
                    <TableHead>Mã nhân viên</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead className="w-16">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTemplate?.users?.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.employee_id || user.id}</TableCell>
                      <TableCell>{user.department || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell>{(selectedTemplate?.users?.length || 0) + 1}</TableCell>
                    <TableCell colSpan={3}>
                      <div className="flex items-center gap-2">
                        <Select value={selectedNewUser} onValueChange={setSelectedNewUser}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Chọn nhân viên" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="p-2">
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Tìm kiếm..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="pl-8"
                                />
                              </div>
                            </div>
                            {availableUsers
                              .filter(
                                (user) =>
                                  user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (user.employee_id || user.id).toLowerCase().includes(searchTerm.toLowerCase()),
                              )
                              .map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.full_name} ({user.employee_id || user.id})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddUser}
                        disabled={!selectedNewUser}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="text-left">
              <Button
                variant="link"
                onClick={() => {
                  const selectTrigger = document.querySelector('[role="combobox"]') as HTMLElement
                  selectTrigger?.click()
                }}
                className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
              >
                Thêm nhân viên áp dụng
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Bỏ qua
              </Button>
              <Button onClick={saveUserAssignments} className="bg-blue-600 hover:bg-blue-700">
                Áp dụng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">{confirmDialog.message}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, user: null, message: "" })}>
              Bỏ qua
            </Button>
            <Button onClick={confirmUserChange} className="bg-blue-600 hover:bg-blue-700">
              Đồng ý
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
