import { CAPABILITIES_CONFIG as CONFIG } from '@/config/capabilities.config';

// CSS-3D equivalent of the former three.js scene (camera at z 35, fov 45°, drei <Html transform
// distanceFactor 15>). drei draws through a CSS perspective equal to the camera's focal length in
// pixels and treats one world unit as one pixel inside it, scaling each card by distanceFactor/400.
// Scaling that whole scene by k = focal / cameraZ gives the same image with a pixel-sized ring:
// everything below is per pixel of stage height.
const FOCAL_PER_HEIGHT = 1 / (2 * Math.tan((CONFIG.CAMERA_FOV * Math.PI) / 180 / 2));
const PX_PER_UNIT_PER_HEIGHT = FOCAL_PER_HEIGHT / CONFIG.CAMERA_Z_POSITION;

export const CYLINDER = {
    perspectivePerHeight: FOCAL_PER_HEIGHT,
    radiusPerHeight: CONFIG.CYLINDER_RADIUS * PX_PER_UNIT_PER_HEIGHT,
    cardScalePerHeight: (CONFIG.CARD_DISTANCE_FACTOR / 400) * PX_PER_UNIT_PER_HEIGHT,
    cardWidth: CONFIG.CARD_WIDTH_PX,
    cardHeight: CONFIG.CARD_HEIGHT_PX,
};

// Card i sits at angle i/n of a full turn; scrolling the section turns the ring by −π·n/2.
export const cardAngle = (index: number, total: number) => (index / total) * Math.PI * 2;
export const maxScrollRotation = (total: number) => -Math.PI * (total / 2);

// Depth styling of a card at `angle` (its own angle plus the ring's rotation): fades and shrinks
// slightly towards the back, disappears near the back, and only the front card takes the pointer.
export function cardDepth(angle: number) {
    const normalizedZ = (Math.cos(angle) + 1) / 2;
    const opacity = Math.pow(normalizedZ, 2);
    return {
        hidden: opacity < 0.05,
        opacity: opacity.toFixed(2),
        transform: `scale(${(0.9 + normalizedZ * 0.1).toFixed(3)})`,
        pointerEvents: opacity > 0.9 ? 'auto' : 'none',
    } as const;
}
