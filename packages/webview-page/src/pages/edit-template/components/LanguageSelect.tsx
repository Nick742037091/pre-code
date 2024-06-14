import classNames from 'classnames'

export function LanguageSelect(props: {
  language: string
  setLanguage: (value: string) => void
}) {
  const wrapperClass = 'border-solid border-2px p-4px'
  const activeClass = classNames(wrapperClass, 'border-primary')
  const inactiveClass = classNames(
    wrapperClass,
    'border-transparent opacity-50'
  )
  const iconList = [
    {
      value: 'html',
      icon: 'i-vscode-icons:file-type-vue'
    },
    {
      value: 'typescript',
      icon: 'i-vscode-icons:file-type-reactjs'
    }
  ]
  return (
    <div className="flex items-center text-24px">
      {iconList.map((item) => (
        <div
          key={item.value}
          className={classNames(
            props.language === item.value ? activeClass : inactiveClass,
            'cursor-pointer'
          )}
          onClick={() => props.setLanguage(item.value)}
        >
          <div className={item.icon} />
        </div>
      ))}
    </div>
  )
}
