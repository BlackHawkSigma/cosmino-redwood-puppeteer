import UpdateNotification from './UpdateToast'

export const generated = (args) => {
  return (
    <span className="inline-block">
      <UpdateNotification {...args} />
    </span>
  )
}

export default { title: 'Components/UpdateNotification' }
