// data/processData.ts
export type ProcessNode = {
    id: string;
    title: string;
    description: string;
    bgColor: string;
    textColor: string;
};

export const processNodes: ProcessNode[] = [
    { id: '01', title: 'Discover', description: 'We immerse in your world — stakeholder interviews, competitive landscape, cultural context — until we see what others miss.', bgColor: '#FF3366', textColor: '#000000' },
    { id: '02', title: 'Define', description: 'From chaos, we extract clarity. We define the north star — the single truth that will guide every decision forward.', bgColor: '#00FFCC', textColor: '#000000' },
    { id: '03', title: 'Design', description: 'This is where intuition meets craft. We prototype at the speed of thought — 3D, motion, typography, colour.', bgColor: '#E6FF00', textColor: '#000000' },
    { id: '04', title: 'Build', description: 'We engineer our designs with the same obsession as we design them. Every animation frame. Every breakpoint.', bgColor: '#FF3300', textColor: '#FFFFFF' },
    { id: '05', title: 'Launch', description: 'We don’t hand off. We launch together, measure obsessively, and iterate until the work exceeds the vision.', bgColor: '#CC00FF', textColor: '#FFFFFF' },
];
