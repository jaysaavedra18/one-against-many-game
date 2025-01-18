export function boxCollision(box1, box2) {
    const xCollisions = box1.right >= box2.left && box1.left <= box2.right;
    const yCollisions = box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom;
    const zCollisions = box1.back >= box2.front && box1.front <= box2.back;
    return xCollisions && yCollisions && zCollisions;
}

