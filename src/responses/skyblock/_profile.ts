import { SkyBlockProfileMember } from './_profile_member'

export type SkyBlockCommunityUpgradeName = 'minion_slots' | 'island_size' | 'guests_count' | 'coins_allowance' | 'coop_slots'

export interface SkyBlockCommunityUpgrades {
	currently_upgrading?: null | {
		upgrade: SkyBlockCommunityUpgradeName,
		new_tier: number,
		start_ms: number,
		who_started: string
	}
	upgrade_states: {
		upgrade: SkyBlockCommunityUpgradeName
		tier: number
		started_ms: number
		started_by: string
		claimed_ms: number
		claimed_by: string
		fasttracked: boolean
	}[]
}

export interface SkyBlockBanking {
	balance: number
	transactions: {
		amount: number
		timestamp: number
		action: 'DEPOSIT' | 'WITHDRAW'
		initiator_name: 'Bank Interest' | string
	}[]
}

export interface SkyBlockProfile {
	profile_id: string
	members: Record<string, SkyBlockProfileMember>
	community_upgrades?: SkyBlockCommunityUpgrades
	last_save?: string
	banking?: SkyBlockBanking
	game_mode?: 'bingo'
}