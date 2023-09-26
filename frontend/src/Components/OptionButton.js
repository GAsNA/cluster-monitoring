import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, Button } from '@nextui-org/react';
import {SettingIcon} from '../Icon/SettingIcon';

function OptionButton({ dropdownItems, background }) {

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Button isIconOnly variant="faded" aria-label="Settings" style={{ background: background }}>
					<SettingIcon />
				</Button>    
			</DropdownTrigger>

			<DropdownMenu aria-label="Ticket Action">
				{ dropdownItems.map((item) => (item))}
			</DropdownMenu>
		</Dropdown>
	 )
}

export default OptionButton;
