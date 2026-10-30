import type { Meta, StoryObj } from '@storybook/react-vite';
import {Logotype} from '../shared/ui/Logo/Logotype';

const meta: Meta<typeof Logotype> = {
    title: 'Component/Logotype',
    component: Logotype,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{padding: 24}}>
                <Story/>
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};