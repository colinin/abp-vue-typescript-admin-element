<template>
  <el-tree
    ref="tree"
    show-checkbox
    node-key="id"
    :data="permissionTreeData"
    :default-checked-keys="[]"
    :render-content="renderContent"
    :default-expanded-keys="permissionExpandedKeys"
    @check="handlePermissionChecked"
    @node-expand="handleNodeExpand"
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
  /** 父节点 */
  parent!: string
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
  /** 是否只读 */
  @Prop({ default: false }) private readonly!: boolean
  /** 是否展开权限树 */
  @Prop({ default: false }) private expanded!: boolean
  /** 是否水平排列
   * @description 功能实现来自：https://www.jianshu.com/p/f740e8c9fca6
   */
  @Prop({ default: false }) private horizontally!: boolean
  /** 权限列表 */
  @Prop({ default: () => new PermissionDto() }) private permission!: PermissionDto
  /** 权限树 */
  private permissionTreeData: PermissionTree[]
  /** 权限树选中节点 */
  private permissionCheckedKeys: string[]
  /** 权限树展开节点 */
  private permissionExpandedKeys: string[]
  /** 授权接口集合 */
  private permissionEditData: IPermission[]

  constructor() {
    super()
    this.permissionTreeData = new Array<PermissionTree>()
    this.permissionCheckedKeys = new Array<string>()
    this.permissionExpandedKeys = new Array<string>()
    this.permissionEditData = new Array<IPermission>()
  }

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
    permissionTree.disabled = this.readonly
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
      permissionTreeItem.disabled = this.readonly
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
      permissionTreeItem.disabled = this.readonly
      // 如果拥有此权限,选中树节点
      // 一个bug,abp返回的权限根节点也是有效的,那这里需要处理下,存在父节点的情况下才会选中
      if (permission.isGranted) {
        if (permission.parentName) {
          this.permissionCheckedKeys.push(permissionTreeItem.id)
        } else {
          // 2020-05-08 如果存在第四级权限，会出现第三级全部未选中bug
          // 查出该节点下的所有子节点
          const childrenPermissions = new Array<Permission>()
          permissions.forEach(p => {
            if (p.parentName === permission.name) {
              childrenPermissions.push(p)
            }
          })
          // 如果没有子节点,选中当前节点
          if (childrenPermissions.length === 0) {
            this.permissionCheckedKeys.push(permissionTreeItem.id)
          } else if (childrenPermissions.every(children => children?.isGranted)) {
            // 如果所有子节点都为授权状态,选中当前节点
            this.permissionCheckedKeys.push(permissionTreeItem.id)
          }
        }
      }
      // 存在父级，则加入父级权限树
      if (permission.parentName) {
        const parentTree = permissionTree.children.find(tree => tree.id === permission.parentName)
        if (parentTree) {
          permissionTreeItem.parent = parentTree.id
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

  /** 节点展开事件
   * @description 监听节点展开完毕事件,刷新子节点样式
   */
  private handleNodeExpand() {
    this.$nextTick().then(() => {
      this.changeTree()
    })
  }

  /** 自定义权限树子节点渲染 */
  private renderContent(h: any, context: { node: any, data: PermissionTree}) {
    if (this.horizontally) {
      let className = ''
      if (context.data && context.data.parent) {
        className = 'horizontally'
        return h(
          'div',
          { class: className },
          [context.node.label])
      }
    }
    return h(
      'span',
      { class: 'el-tree-node__label' },
      [context.node.label]
    )
  }

  /** 变更权限树样式
   * @description https://www.jianshu.com/p/f740e8c9fca6
   */
  private changeTree() {
    const classDomList = document.getElementsByClassName('horizontally')
    for (let i = 0; i < classDomList.length; i++) {
      const parentNode = classDomList[i].parentNode as any
      parentNode.style.cssText = 'float: left'
      parentNode.className = 'el-tree-node__content option-wrapper'
      parentNode.parentNode.style.marginLeft = '70px'
    }
  }
}
</script>

<style lang="scss" scoped>
.option-wrapper {
  padding: 0 !important;
}
</style>
