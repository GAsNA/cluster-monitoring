import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, Button } from '@nextui-org/react';
import {VerticalDotsIcon} from '../Icon/VerticalDotsIcon';

function VerticalDotsButton({ dropdownItems, onPress="" }) {

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Button isIconOnly variant="light" aria-label="Settings" size="sm" onPress={onPress}>
					<VerticalDotsIcon className="text-default-300" />
				</Button>    
			</DropdownTrigger>

			<DropdownMenu aria-label="Ticket Action">
				{ dropdownItems.map((item) => (item))}
			</DropdownMenu>
		</Dropdown>
	 )
}

export default VerticalDotsButton;
