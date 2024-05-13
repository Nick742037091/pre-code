import classNames from 'classnames'
import { forwardRef } from 'react'
import LeftList from './LeftList'
import RightList from './RightList'
import Main from './Main'

export default forwardRef(function FormItemList(
  props: { blockStyle: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any
) {
  return (
    <div
      className={classNames(
        props.blockStyle,
        'p-10px flex-1 flex items-stretch bg-#eee '
      )}
      css={{ height: 'calc(100vh - 162px)' }}
    >
      <LeftList />
      <Main />
      <RightList />
    </div>
  )
})
