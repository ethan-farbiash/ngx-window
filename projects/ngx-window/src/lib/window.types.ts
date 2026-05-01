export type HorizontalAnchor = 'left' | 'center' | 'right';
export type VerticalAnchor = 'top' | 'center' | 'bottom';

export interface Alignment {
    horizontal?: HorizontalAnchor;
    vertical?: VerticalAnchor;
}

export interface Position {
    top: number,
    left: number,
    width: number,
    height: number
}

export interface Offset {
    top: number,
    left: number
}

export interface KeepOpenOptions {
    onClickOutside?: boolean;
    onIntersection?: boolean;
}

export interface VisibilityOptions {
    startOpen?: boolean;
    keepOpen?: KeepOpenOptions;
}

export interface AlignmentOptions {
    window?: Alignment;
    reference?: Alignment;
}

export interface AdaptivePlacement {
    alignment?: AlignmentOptions;
    topOffset?: number;
    leftOffset?: number;
}

export interface AdaptivePositionOptions {
    placements: AdaptivePlacement[];
    viewportPadding?: number;
}

export interface WindowOptions {
    visibility?: VisibilityOptions,
    alignment?: AlignmentOptions,
    adaptivePosition?: AdaptivePositionOptions
};
