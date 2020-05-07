<template>
  <el-tree
    ref="tree"
    show-checkbox
    node-key="id"
    :data="permissionTreeData"
    :default-checked-keys="[]"
    :default-expanded-keys="permissionExpandedKeys"
    @check="handlePermissionChecked"
  />
</template>

<script lang="ts">
import { IPermission } from '@/api/types'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { PermissionDto, PermissionGroup, Permission } from '@/api/permission'

/** element权限树 */
export class PermissionTree {
  /** 权限标识 */
  id!: string
  /** 显示名称 */
  label!: string
  /** 是否禁用 */
  disabled!: boolean
  /** 子节点 */
  children!: PermissionTree[]

  constructor() {
    this.disabled = false
    this.children = new Array<PermissionTree>()
  }
}

/** 权限树组件 */
@Component({
  name: 'PermissionTree'
})
export default class extends Vue {
  /** 是否展开权限树 */
  @Prop({ default: false }) private expanded!: boolean
  /** 权限列表 */
  @Prop({ default: () => new PermissionDto() }) private permission!: PermissionDto
  /** 权限树 */
  private permissionTreeData = new Array<PermissionTree>()
  /** 权限树选中节点 */
  private permissionCheckedKeys = new Array<string>()
  /** 权限树展开节点 */
  private permissionExpandedKeys = new Array<string>()
  /** 授权接口集合 */
  private permissionEditData = new Array<IPermission>()

  mounted() {
    this.initilzePermissionTree(this.permission)
    setTimeout(() => {
      const treeControl = this.$refs.tree as any
      treeControl.setCheckedKeys(this.permissionCheckedKeys)
    }, 10)
  }

  /** 初始化权限树
   * @param permission 权限数据
   */
  private initilzePermissionTree(permission: PermissionDto) {
    const permissionTree = new PermissionTree()
    permissionTree.id = permission.entityDisplayName
    permissionTree.label = '权限设置'
    this.generatePermissionGroup(permissionTree, permission.groups)
    this.permissionTreeData.push(permissionTree)
    this.permissionExpandedKeys.push(permissionTree.id)
  }

  /** 根据权限组生成二级权限树
   * @param permissionTree 根权限树
   * @param permissionGroups 根权限组
   */
  private generatePermissionGroup(permissionTree: PermissionTree, permissionGroups: PermissionGroup[]) {
    permissionGroups.forEach((group) => {
      const permissionTreeItem = new PermissionTree()
      permissionTreeItem.id = group.name
      permissionTreeItem.label = group.displayName
      // 父节点是否全部展开
      if (this.expanded) {
        this.permissionExpandedKeys.push(group.name)
      }
      this.generatePermission(permissionTreeItem, group.permissions)
      permissionTree.children.push(permissionTreeItem)
      // 父权限加入编辑权限列表
      // 按照abp框架的授权规则,Group（也就是二级权限数据）是不允许赋值的,要么后台过滤,要么前台不传,这里采用前台不传
      // this.permissionEditData.push({ name: group.name, isGranted: group.permissions.some(p => p.isGranted) })
    })
  }

  /** 根据权限列表生成三级权限树
   * @param permissionTree 二级权限树
   * @param permissions 权限列表
   */
  private generatePermission(permissionTree: PermissionTree, permissions: Permission[]) {
    permissions.forEach((permission) => {
      const permissionTreeItem = new PermissionTree()
      permissionTreeItem.id = permission.name
      permissionTreeItem.label = permission.displayName
      // 如果拥有此权限,选中树节点
      // 一个bug,abp返回的权限根节点也是有效的,那这里需要处理下,存在父节点的情况下才会选中
      if (permission.isGranted) {
        if (permission.parentName) {
          this.permissionCheckedKeys.push(permissionTreeItem.id)
        }
      }
      // 存在父级，则加入父级权限树
      if (permission.parentName) {
        const parentTree = permissionTree.children.find(tree => tree.id === permission.parentName)
        if (parentTree) {
          parentTree.children.push(permissionTreeItem)
        }
      } else {
        permissionTree.children.push(permissionTreeItem)
      }
      // 加入编辑权限列表
      this.permissionEditData.push({ name: permission.name, isGranted: permission.isGranted })
    })
  }

  /** 权限树选择相应事件 */
  private handlePermissionChecked(data: any, treeCheckData: any) {
    this.permissionEditData.forEach((permission: IPermission) => {
      permission.isGranted = treeCheckData.checkedKeys.some((k: string) => k.indexOf(permission.name) !== -1)
    })
    // 传递权限变更事件,事件参数为授权接口集合
    this.$emit('onPermissionChanged', this.permissionEditData)
  }
}
</script>
