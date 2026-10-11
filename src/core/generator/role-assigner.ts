import { Mission, MissionRole } from '../domain/mission.types';
import { AssignedRole } from '../domain/adventure.types';

const GENERAL_BACKUP_ROLES: MissionRole[] = [
  { id: 'scout', title: 'Scout', duty: 'Eyes and ears scanning the forward perimeter.' },
  { id: 'chronicler', title: 'Chronicler', duty: 'Keeps team focus and documents achievements.' },
  { id: 'timekeeper', title: 'Timekeeper', duty: 'Tracks the countdown clock and mission pacing.' },
  { id: 'catalyst', title: 'Catalyst', duty: 'Brings spontaneous energy and moral encouragement.' },
];

export function assignRoles(
  mission: Mission,
  participantCount: number
): AssignedRole[] {
  const availableRoles: MissionRole[] = [
    ...(mission.suggestedRoles && mission.suggestedRoles.length > 0
      ? mission.suggestedRoles
      : GENERAL_BACKUP_ROLES),
    ...GENERAL_BACKUP_ROLES,
  ];

  const assignments: AssignedRole[] = [];

  for (let i = 1; i <= participantCount; i++) {
    const roleIndex = (i - 1) % availableRoles.length;
    assignments.push({
      role: availableRoles[roleIndex],
      participantNumber: i,
    });
  }

  return assignments;
}
