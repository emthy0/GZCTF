import {
  Button,
  Modal,
  ModalProps,
  SimpleGrid,
  Stack,
  TextInput,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { mdiCheck } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showErrorMsg } from '@Utils/Shared'
import api, { UserCreateModel, UserInfoModel } from '@Api'

interface UserCreateModalProps extends ModalProps {
  onUserCreated: (user: UserInfoModel) => void
}

export const UserCreateModal: FC<UserCreateModalProps> = (props) => {
  const { onUserCreated, ...modalProps } = props

  const [disabled, setDisabled] = useState(false)
  const [user, setUser] = useState<UserCreateModel>({
    userName: '',
    password: '',
    email: '',
    realName: '',
    stdNumber: '',
    phone: '',
    teamName: '',
  })

  const { t } = useTranslation()

  const onCreateUser = async () => {
    if (!user.userName || !user.password || !user.email) return

    setDisabled(true)

    try {
      const newUser = await api.admin.adminCreateUser(user)
      showNotification({
        color: 'teal',
        message: t('admin.notification.users.created'),
        icon: <Icon path={mdiCheck} size={1} />,
      })
      onUserCreated(newUser.data)
      modalProps.onClose()
      // Reset form
      setUser({
        userName: '',
        password: '',
        email: '',
        realName: '',
        stdNumber: '',
        phone: '',
        teamName: '',
      })
    } catch (e) {
      showErrorMsg(e, t)
    } finally {
      setDisabled(false)
    }
  }

  return (
    <Modal {...modalProps} title={t('admin.button.create_user')}>
      <Stack gap="md" m="auto" mt={15}>
        <SimpleGrid cols={2}>
          <TextInput
            label={t('account.label.username')}
            type="text"
            value={user.userName}
            disabled={disabled}
            required
            onChange={(event) => setUser({ ...user, userName: event.target.value })}
          />
          <TextInput
            label={t('account.label.password')}
            type="password"
            value={user.password}
            disabled={disabled}
            required
            onChange={(event) => setUser({ ...user, password: event.target.value })}
          />
          <TextInput
            label={t('account.label.email')}
            type="email"
            value={user.email}
            disabled={disabled}
            required
            onChange={(event) => setUser({ ...user, email: event.target.value })}
          />
          <TextInput
            label={t('account.label.real_name')}
            type="text"
            value={user.realName ?? ''}
            disabled={disabled}
            onChange={(event) => setUser({ ...user, realName: event.target.value })}
          />
          <TextInput
            label={t('account.label.student_id')}
            type="text"
            value={user.stdNumber ?? ''}
            disabled={disabled}
            onChange={(event) => setUser({ ...user, stdNumber: event.target.value })}
          />
          <TextInput
            label={t('account.label.phone')}
            type="tel"
            value={user.phone ?? ''}
            disabled={disabled}
            onChange={(event) => setUser({ ...user, phone: event.target.value })}
          />
        </SimpleGrid>
        <TextInput
          label={t('team.label.name')}
          type="text"
          value={user.teamName ?? ''}
          disabled={disabled}
          placeholder={t('admin.placeholder.team_name_optional')}
          onChange={(event) => setUser({ ...user, teamName: event.target.value })}
        />

        <Button
          fullWidth
          disabled={disabled || !user.userName || !user.password || !user.email}
          onClick={onCreateUser}
        >
          {t('admin.button.create_user')}
        </Button>
      </Stack>
    </Modal>
  )
}