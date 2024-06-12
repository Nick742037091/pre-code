import {
  CloseCircleOutlined,
  CloseOutlined,
  DownOutlined,
  ExportOutlined,
  FormOutlined
} from '@ant-design/icons'
import { Button, Card, Dropdown, Popconfirm, Tooltip, message } from 'antd'
import { useAddConfig } from './components/AddConfig'
import { Config, ConfigTypeNames, useConfig } from '@/stores/config'
import classNames from 'classnames'
import { useEffect } from 'react'
import { nativeCommond } from '@/utils/bridge'
import { cloneDeep } from 'lodash'
import { nanoid } from 'nanoid'
import { MenuProps } from 'antd/lib'
import { usePrompt } from '@/hooks/components'

function Header(props: {
  addTemplate: () => void
  importConfig: () => void
  importByUrl: () => void
  onClose: () => void
}) {
  const onMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'link':
        props.importByUrl()
        break
    }
  }

  return (
    <div
      className="flex items-center text-24px font-bold py-15px px-10px"
      css={{
        borderBottom: 'solid 2px #eee'
      }}
    >
      <div className="flex-shrink-0">配置列表</div>
      <Button
        type="primary"
        className="ml-20px"
        size="middle"
        onClick={props.addTemplate}
      >
        添加配置
      </Button>
      <Dropdown.Button
        type="primary"
        size="middle"
        className="ml-20px"
        icon={<DownOutlined />}
        onClick={props.importConfig}
        menu={{
          items: [{ key: 'link', label: '通过链接导入' }],
          onClick: onMenuClick
        }}
      >
        导入配置
      </Dropdown.Button>
      <CloseCircleOutlined
        className="ml-auto cursor-pointer"
        onClick={props.onClose}
      />
    </div>
  )
}
export default function ConfigList(props: {
  visible: boolean
  setVisible: (val: boolean) => void
}) {
  const {
    context: importPromptCtx,
    showPrompt: showImportPrompt,
    setPromptVisible
  } = usePrompt()
  const {
    configList,
    deleteConfig,
    setCurrentConfigId,
    currentConfig,
    addConfig
  } = useConfig()
  const { context: addConfigContext, showModal } = useAddConfig()
  // 加载时没有配置列表，弹出添加配置弹窗
  useEffect(() => {
    if (configList.length === 0) {
      showModal('add')
    }
  }, [])

  const handleImportConfig = async () => {
    const data = await nativeCommond<{ content: string }>({
      command: 'readFile'
    })
    if (!data) return
    parseConfigAndImport(data.content)
  }

  const parseConfigAndImport = async (data: string) => {
    // TODO 配置校验
    try {
      const config = JSON.parse(data) as Config
      config.id = nanoid()
      addConfig(config)
    } catch {
      message.error('读取配置失败')
    }
  }

  const handleImportByUrl = async () => {
    const { confirm, value: url } = await showImportPrompt({
      title: '请输入配置链接',
      defaultValue: ''
    })
    if (!confirm) {
      setPromptVisible(false)
      return
    }
    const { content } = await nativeCommond<{ content: string }>({
      command: 'fetchUrl',
      params: {
        url
      }
    })
    console.log('content', content)
    setPromptVisible(false)
    parseConfigAndImport(content)
  }

  const exportConfig = (item: Config) => {
    const newItem = cloneDeep(item)
    nativeCommond({
      command: 'saveFile',
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
      {importPromptCtx}
      <Header
        addTemplate={() => showModal('add')}
        importConfig={handleImportConfig}
        importByUrl={handleImportByUrl}
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
              key={item.id}
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
