// import './App.css';
import TreeFilter from './components/treeFilter'
import React,{ useState ,useEffect} from 'react'
import { Row, Col } from 'antd'
import Styles from './app.less'

function App() {
  const [ Loading,setLoading ] = useState(false)
  const [ treeData,setTreeDate ] = useState([])
  const [ activeId, setActiveId ] = useState('1')

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setTreeDate([
        {
          title: '测试1-1级菜单',
          key: '1',
          children: [
            {
              title: '测试2-1级菜单',
              key: '1-1',
              children:[
                {
                  title: '测试3-1级菜单',
                  key: '1-2-1',
                },
                {
                  title: '测试3-2级菜单',
                  key: '1-2-2',
                }
              ]
            },
            {
              title: '测试2-2级菜单',
              key: '1-2',
            },
            {
              title: '测试2-3级菜单',
              key: '1-3',
            }
          ]
        },
        {
          title: '测试1-2级菜单',
          key: '2',
          children:[
            {
              title: '测试2-1级菜单',
              key: '2-1',
            },
            {
              title: '测试2-2级菜单',
              key: '2-2',
            }
          ]
        },
        {
          title: '测试1-3级菜单',
          key: '3',
        }
      ])
    },1000)
  },[])

  function onCateIdChange(item) {
    setActiveId(item.key)
  }


  return (
    <div  className={Styles.list_wrap}>
      <Row gutter={32}>
        <Col className="gutter-row" span={7}>
          <TreeFilter 
            title="菜单Title"
            deleteTip="删除后将子级数据一并删除，确定删除吗？"
            loading={Loading}
            treeDataDefault={treeData}
            treeActive={activeId}
            onActiveChange={onCateIdChange}
            addLevelNum={2}
          />
        </Col>
      </Row>
     
    </div>
  );
}

export default App;
