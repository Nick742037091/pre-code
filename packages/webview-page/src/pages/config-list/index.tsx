import {
  CloseCircleOutlined,
  CloseOutlined,
  ExportOutlined,
  FormOutlined
} from '@ant-design/icons'
import { Button, Card, Popconfirm, Tooltip, message } from 'antd'
import { useAddConfig } from './components/AddConfig'
import { Config, ConfigTypeNames, useConfig } from '@/stores/config'
import classNames from 'classnames'
import { useEffect } from 'react'
import { nativeCommond } from '@/utils/bridge'
import { cloneDeep } from 'lodash'

function Header(props: { addTemplate: () => void; onClose: () => void }) {
  return (
    <div
      className="flex items-center text-24px font-bold py-15px px-10px"
      css={{
        borderBottom: 'solid 2px #eee'
      }}
    >
      配置列表
      <Button type="primary" ml-20px onClick={props.addTemplate}>
        添加配置
      </Button>
      <CloseCircleOutlined ml-auto cursor-pointer onClick={props.onClose} />
    </div>
  )
}
export default function ConfigList(props: {
  visible: boolean
  setVisible: (val: boolean) => void
}) {
  const { configList, deleteConfig, setCurrentConfigId, currentConfig } =
    useConfig()
  const { context: addConfigContext, showModal } = useAddConfig()
  // 加载时没有配置列表，弹出添加配置弹窗
  useEffect(() => {
    if (configList.length === 0) {
      showModal('add')
    }
  }, [])

  const exportConfig = (item: Config) => {
    const newItem = cloneDeep(item)
    newItem.templateList = []
    nativeCommond({
      command: 'exportToFile',
      params: {
        fileName: `${item.configName}.json`,
        data: JSON.stringify(newItem)
      }
    })
  }

  const hoverIconClass =
    'hover:bg-blue hover:color-white hover:rounded-50% cursor-pointer  p-10px'
  return (
    <div
      className="position-fixed h-100vh w-100vw box-border overflow-auto bg-white z-1000 px-20px"
      css={{
        top: props.visible ? '0' : '-100vh',
        transition: 'all ease 0.3s'
      }}
    >
      {addConfigContext}
      <Header
        addTemplate={() => showModal('add')}
        onClose={() => {
          if (!currentConfig) {
            return message.warning('请先选择配置')
          }
          props.setVisible(false)
        }}
      />
      <div className="flex flex-wrap">
        {configList.map((item, index) => {
          return (
            <Card
              style={{ cursor: 'pointer' }}
              key={item.configName}
              title={item.configName}
              bordered={false}
              onClick={() => {
                setCurrentConfigId(item.id)
                props.setVisible(false)
              }}
              extra={
                <div onClick={(e) => e.stopPropagation()}>
                  <Tooltip placement="bottom" title="导出配置">
                    <ExportOutlined
                      className={classNames('mr-10px', hoverIconClass)}
                      onClick={() => exportConfig(item)}
                    />
                  </Tooltip>
                  <Tooltip placement="bottom" title="编辑配置">
                    <FormOutlined
                      className={classNames('mr-10px', hoverIconClass)}
                      onClick={() => {
                        showModal('edit', item)
                      }}
                    />
                  </Tooltip>
                  <Tooltip placement="bottom" title="删除配置">
                    <Popconfirm
                      title="是否删除配置？"
                      onConfirm={() => {
                        deleteConfig(index)
                      }}
                      okText="是"
                      cancelText="否"
                      placement="bottom"
                    >
                      <CloseOutlined className={classNames(hoverIconClass)} />
                    </Popconfirm>
                  </Tooltip>
                </div>
              }
              className="m-10px bg-#ddd"
              css={{
                width: 'calc((100% - 40px)/2)'
              }}
            >
              <div>
                模板类型：
                {ConfigTypeNames[item.configType]}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
