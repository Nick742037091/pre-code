export default function RightList() {
  return (
    <div className="w-300px flex flex-col bg-white border-solid border-slate-200 rounded-8px">
      <div
        className="font-18px text-center font-500 p-10px"
        css={{
          borderBottom: '1px solid #eee'
        }}
      >
        表单项信息
      </div>
      <div className="flex-1 overflow-auto"></div>
    </div>
  )
}
