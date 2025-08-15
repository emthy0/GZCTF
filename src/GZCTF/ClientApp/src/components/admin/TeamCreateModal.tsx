import {
  Button,
  Modal,
  ModalProps,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { mdiCheck } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showErrorMsg } from '@Utils/Shared'
import api, { AdminCreateTeamModel, TeamInfoModel, UserInfoModel } from '@Api'
import { CountryAutocomplete } from '../CountryAutocomplete'

interface TeamCreateModalProps extends ModalProps {
  users: UserInfoModel[]
  onTeamCreated: (team: TeamInfoModel) => void
}

export const TeamCreateModal: FC<TeamCreateModalProps> = (props) => {
  const { users, onTeamCreated, ...modalProps } = props

  const [disabled, setDisabled] = useState(false)
  const [team, setTeam] = useState<AdminCreateTeamModel>({
    name: '',
    bio: '',
    country: '',
    captainId: '',
  })
  const [captainUserName, setCaptainUserName] = useState('')

  const { t } = useTranslation()

  const onCreateTeam = async () => {
    if (!team.name || !team.captainId) return

    setDisabled(true)

    try {
      const newTeam = await api.admin.adminCreateTeam(team)
      showNotification({
        color: 'teal',
        message: t('admin.notification.teams.created'),
        icon: <Icon path={mdiCheck} size={1} />,
      })
      onTeamCreated(newTeam.data)
      modalProps.onClose()
      // Reset form
      setTeam({
        name: '',
        bio: '',
        country: '',
        captainId: '',
      })
      setCaptainUserName('')
    } catch (e) {
      showErrorMsg(e, t)
    } finally {
      setDisabled(false)
    }
  }

  const handleCaptainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userName = event.target.value
    setCaptainUserName(userName)
    
    const user = users.find(u => u.userName === userName)
    if (user) {
      setTeam({ ...team, captainId: user.id! })
    } else {
      setTeam({ ...team, captainId: '' })
    }
  }

  return (
    <Modal {...modalProps} title={t('admin.button.create_team')}>
      <Stack gap="md" m="auto" mt={15}>
        <TextInput
          label={t('team.label.name')}
          type="text"
          value={team.name}
          disabled={disabled}
          required
          onChange={(event) => setTeam({ ...team, name: event.target.value })}
        />
        
        <TextInput
          label={t('team.label.captain')}
          type="text"
          value={captainUserName}
          disabled={disabled}
          required
          placeholder={t('admin.placeholder.captain_username')}
          onChange={handleCaptainChange}
        />

        <Textarea
          label={t('team.label.bio')}
          value={team.bio ?? ''}
          disabled={disabled}
          autosize
          minRows={2}
          maxRows={4}
          placeholder={t('team.placeholder.bio')}
          onChange={(event) => setTeam({ ...team, bio: event.target.value })}
        />

        <CountryAutocomplete
          label={t('team.label.country')}
          placeholder={t('team.placeholder.country')}
          value={team.country ?? ''}
          disabled={disabled}
          maxLength={72}
          onChange={(value) => setTeam({ ...team, country: value })}
        />

        <Button
          fullWidth
          disabled={disabled || !team.name || !team.captainId}
          onClick={onCreateTeam}
        >
          {t('admin.button.create_team')}
        </Button>
      </Stack>
    </Modal>
  )
}