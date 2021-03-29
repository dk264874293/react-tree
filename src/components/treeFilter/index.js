import React, { useState,useEffect } from 'react'
import { Input, Button, Icon, Popconfirm, Tooltip } from 'antd'
import { cloneDeep } from 'loadsh'
import Style from './index.less'

const { Search } = Input

const defaultOption = {
  title: 'title',
  key: 'key',
  children: 'children'
}

function TreeFilter(props){
  const {
    addLevelNum,
    title,
    loading,
    isShowEdit,
    deleteTip,
    treeDataDefault,
    dataOption,
    treeActive,
    isShowAddBtn,
    onActiveChange,
    onDataDelete,
    onAddChange,
    onEditChange,
  } = props

  const [ searchText, setSearchText ] = useState('')

  const [ dataEnum, setDataEnum ] = useState(defaultOption)

  const [ treeData, setTreeData ] = useState([])

  useEffect(() => {
    setDataEnum((state) => ({ ...state, ...dataOption }))
  }, [dataOption])

  useEffect(() => {
    setTreeData(treeDataDefault)
  }, [treeDataDefault])

  // 树的展开收起
  function treeSquareChange(item){
    item.isNotShow = !item.isNotShow
    setTreeData(cloneDeep(treeData))
  }

  function onAdd(e,item){
    e && e.stopPropagation()
    onAddChange({ parentId :item.id})
  }

  function onEdit(e, item) {
    e.stopPropagation()
    onEditChange(item)
  }

  // 生成树的render
  function renderTree(treeList, level = 1) {
    return treeList.map((item) => (
      <div key={item[dataEnum.key]} style={{ paddingLeft: '16px' }}>
        <div
          className={[
            treeActive === item[dataEnum.key] ? Style.active : '',
            Style.treeList,
          ].join(' ')}
          onClick={() => {
            onActiveChange(item)
          }}
        >
          {item[dataEnum.children] && item[dataEnum.children].length > 0 ? (
            !item.isNotShow ? (
              <Icon
                type="plus-square"
                className={Style.icon}
                onClick={() => treeSquareChange(item)}
              />
            ) : (
              <Icon
                type="minus-square"
                className={Style.icon}
                onClick={() => treeSquareChange(item)}
              />
            )
          ) : null}
          <Tooltip placement="topLeft" title={item[dataEnum.title]}>
            <span className={Style.treeTitle}>{item[dataEnum.title]}</span>
          </Tooltip>

          {isShowEdit && item[dataEnum.key] !== '0' ? (
            <span className={Style.editBtn}>
              {addLevelNum >= level ? (
                <Icon type="plus-circle" onClick={(e) => onAdd(e, item)} />
              ) : null}

              <Icon type="edit" onClick={(e) => onEdit(e, item)} />
              <Popconfirm
                onConfirm={(e) => {
                   e && e.stopPropagation()
                  onDataDelete(item)
                }}
                title={deleteTip}
                okText="是"
                cancelText="否"
              >
                <Icon type="delete" onClick={(e) => e && e.stopPropagation()} />
              </Popconfirm>
            </span>
          ) : null}
        </div>

        {item.isNotShow &&
        item[dataEnum.children] &&
        item[dataEnum.children].length > 0
          ? renderTree(item[dataEnum.children], level + 1)
          : null}
      </div>
    ))
  }

  // 搜索过滤树
  function filterTree(tree,searchText,filterList = []){
    if (!searchText){
      return tree
    }

    for (const item of tree) {

      if (item[dataEnum.title].indexOf(searchText) > -1) {
        filterList.push(item)
        continue
      }

       if (item[dataEnum.children] && item[dataEnum.children].length > 0) {
         filterTree(item[dataEnum.children], searchText, filterList)
       }
    }

    return filterList
  }

  const filterTreeData = [
    { [dataEnum.title]: '全部项目', [dataEnum.key]: '0' },
  ].concat(filterTree(treeData, searchText) || [])

  const addBtn = isShowAddBtn ? (
    <div className={Style.newTreeBtn}>
      <Button loading={loading} onClick={() => onAddChange()} type="primary">
        新增
      </Button>
    </div>
  ) : null

  return (
    <>
      <Search
        placeholder={`请输入${title}`}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {addBtn}
      <div className={Style.treeContent}>
        <h5>{title}</h5>
        {renderTree(filterTreeData)}
      </div>
    </>
  )
}

TreeFilter.defaultProps = {
  addLevelNum: 1,
  title: '',
  isShowEdit: true,
  loading: false,
  deleteTip: '',
  treeActive: '',
  dataOption: {
    title: 'title',
    children: 'children',
    key: 'key',
  },
  treeDataDefault: [],
  isShowAddBtn: true,
  onActiveChange: () => {},
  onDataDelete: () => {},
  onAddChange: () => {},
  onEditChange: () => {},
}

export default TreeFilter
