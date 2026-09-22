import type { CSSProperties } from 'react';
import { PROJECTS_DATA } from '@/data/workminimal-projects';
import WorkDesktop from './WorkDesktop';
import WorkMobile from './WorkMobile';
import styles from './WorkMinimal.module.css';

// Server-rendered Selected Works. Both layouts ship in the HTML and the breakpoint in
// WorkMinimal.module.css shows one of them: WorkDesktop (a sticky scroll-through, (projects + 0.8)
// viewports tall) or WorkMobile (title list + project sheet). Each is a client leaf.
export default function WorkMinimal() {
    return (
        <section
            id="work"
            aria-labelledby="work-title"
            className={styles.scrollContainer}
            style={{ '--project-count': PROJECTS_DATA.length } as CSSProperties}
        >
            <WorkDesktop />
            <WorkMobile />
        </section>
    );
}
