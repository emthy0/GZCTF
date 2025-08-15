import {
  Avatar,
  Button,
  Group,
  Modal,
  ModalProps,
  ScrollArea,
  Select,
  Stack,
  Text,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { mdiCheck, mdiClose } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showErrorMsg } from '@Utils/Shared'
import api, { TeamInfoModel, UserInfoModel } from '@Api'

interface TeamAssignmentModalProps extends ModalProps {
  team: TeamInfoModel
  availableUsers: UserInfoModel[]
  onTeamUpdated: (team: TeamInfoModel) => void
}

export const TeamAssignmentModal: FC<TeamAssignmentModalProps> = (props) => {
  const { team, availableUsers, onTeamUpdated, ...modalProps } = props

  const [disabled, setDisabled] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const { t } = useTranslation()

  const onAssignUser = async () => {
    if (!selectedUserId) return

    setDisabled(true)

    try {
      await api.admin.adminAssignUserToTeam(team.id!, selectedUserId)
      showNotification({
        color: 'teal',
        message: t('admin.notification.teams.user_assigned'),
        icon: <Icon path={mdiCheck} size={1} />,
      })
      
      const user = availableUsers.find(u => u.id === selectedUserId)
      if (user) {
        const updatedTeam = {
          ...team,
          members: [...(team.members || []), user]
        }
        onTeamUpdated(updatedTeam)
      }
      
      setSelectedUserId(null)
    } catch (e) {
      showErrorMsg(e, t)
    } finally {
      setDisabled(false)
    }
  }

  const onRemoveUser = async (userId: string) => {
    if (team.captain?.id === userId) {
      showNotification({
        color: 'red',
        message: t('admin.notification.teams.cannot_remove_captain'),
      })
      return
    }

    setDisabled(true)

    try {
      await api.admin.adminRemoveUserFromTeam(team.id!, userId)
      showNotification({
        color: 'teal',
        message: t('admin.notification.teams.user_removed'),
        icon: <Icon path={mdiCheck} size={1} />,
      })
      
      const updatedTeam = {
        ...team,
        members: (team.members || []).filter(m => m.id !== userId)
      }
      onTeamUpdated(updatedTeam)
    } catch (e) {
      showErrorMsg(e, t)
    } finally {
      setDisabled(false)
    }
  }

  const usersNotInTeam = availableUsers.filter(
    user => !(team.members || []).some(member => member.id === user.id)
  )

  return (
    <Modal {...modalProps} title={t('admin.label.manage_team_members')} size="md">
      <Stack gap="md" m="auto" mt={15}>
        <Group>
          <Select
            placeholder={t('admin.placeholder.select_user')}
            data={usersNotInTeam.map(user => ({
              value: user.id!,
              label: user.userName!
            }))}
            value={selectedUserId}
            onChange={setSelectedUserId}
            flex={1}
            disabled={disabled}
          />
          <Button
            disabled={disabled || !selectedUserId}
            onClick={onAssignUser}
          >
            {t('admin.button.assign')}
          </Button>
        </Group>

        <Text size="sm" fw={500}>{t('team.label.members')}</Text>
        <ScrollArea h={300} offsetScrollbars>
          <Stack gap="xs">
            {team.members?.map((user) => (
              <Group key={user.id} justify="space-between">
                <Group justify="left">
                  <Avatar alt="avatar" src={user.avatar} radius="xl">
                    {user.userName?.slice(0, 1) ?? 'U'}
                  </Avatar>
                  <Stack gap={0}>
                    <Text fw={500}>{user.userName}</Text>
                    <Text size="xs" c="dimmed">{`#${user.id?.substring(28)}`}</Text>
                  </Stack>
                  {user.captain && <Text size="xs" c="yellow">(Captain)</Text>}
                </Group>
                {!user.captain && (
                  <Button
                    size="xs"
                    variant="outline"
                    color="red"
                    disabled={disabled}
                    onClick={() => onRemoveUser(user.id!)}
                  >
                    <Icon path={mdiClose} size={0.7} />
                  </Button>
                )}
              </Group>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Modal>
  )
}