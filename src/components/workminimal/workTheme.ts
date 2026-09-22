// Shared by the Selected Works leaves.
export const PROJECT_COLORS = ['#FFD500', '#FF3366', '#00FF66', '#00C3FF', '#B033FF', '#FF8C00'];

// The layout breakpoint. WorkMinimal.module.css switches the two layouts at the same width
// (max-width: 1024px); keep both in step.
export const WORK_MOBILE_QUERY = '(max-width: 1024px)';

export const projectColor = (index: number) => PROJECT_COLORS[index % PROJECT_COLORS.length];
