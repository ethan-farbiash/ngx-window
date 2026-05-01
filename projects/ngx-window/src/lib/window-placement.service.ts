import { Injectable } from '@angular/core';
import { AlignmentService } from './alignment.service';
import { AdaptivePlacement, AlignmentOptions, Offset, Position } from './window.types';

interface PlacementCandidate {
    alignment?: AlignmentOptions;
    topOffset: number;
    leftOffset: number;
}

interface ResolvedCandidate {
    offset: Offset;
    overflow: number;
}

export interface WindowPlacementRequest {
    alignment?: AlignmentOptions;
    adaptivePlacements?: AdaptivePlacement[];
    height: number;
    leftOffset: number;
    referencePosition?: Position;
    topOffset: number;
    viewportPadding?: number;
    width: number;
}

@Injectable()
export class WindowPlacementService {
    constructor(private alignmentService: AlignmentService) { }

    resolve(request: WindowPlacementRequest): Offset {
        const candidates = this.buildCandidates(request);
        let bestCandidate: ResolvedCandidate | undefined;

        for (const candidate of candidates) {
            const resolved = this.resolveCandidate(request, candidate);

            if (resolved.overflow === 0) {
                return resolved.offset;
            }

            if (!bestCandidate || resolved.overflow < bestCandidate.overflow) {
                bestCandidate = resolved;
            }
        }

        return bestCandidate?.offset ?? { top: request.topOffset, left: request.leftOffset };
    }

    private buildCandidates(request: WindowPlacementRequest): PlacementCandidate[] {
        const primaryAlignment = request.alignment;
        const primaryCandidate: PlacementCandidate = {
            alignment: primaryAlignment,
            topOffset: request.topOffset,
            leftOffset: request.leftOffset
        };

        const fallbackCandidates = (request.adaptivePlacements ?? []).map((placement) => {
            const alignment = this.mergeAlignment(primaryAlignment, placement.alignment);

            return {
                alignment,
                topOffset: placement.topOffset ?? this.resolveVerticalOffset(request.topOffset, primaryAlignment, alignment),
                leftOffset: placement.leftOffset ?? this.resolveHorizontalOffset(request.leftOffset, primaryAlignment, alignment)
            };
        });

        return [primaryCandidate, ...fallbackCandidates];
    }

    private resolveCandidate(request: WindowPlacementRequest, candidate: PlacementCandidate): ResolvedCandidate {
        const offset = this.alignmentService.align(
            {
                top: candidate.topOffset,
                left: candidate.leftOffset,
                width: request.width,
                height: request.height
            },
            candidate.alignment?.window,
            request.referencePosition,
            candidate.alignment?.reference
        );

        return {
            offset,
            overflow: this.calculateOverflow(offset, request.width, request.height, request.viewportPadding ?? 0)
        };
    }

    private mergeAlignment(primary?: AlignmentOptions, override?: AlignmentOptions): AlignmentOptions | undefined {
        if (!primary && !override) {
            return undefined;
        }

        return {
            window: {
                ...primary?.window,
                ...override?.window
            },
            reference: {
                ...primary?.reference,
                ...override?.reference
            }
        };
    }

    private resolveHorizontalOffset(offset: number, primary?: AlignmentOptions, candidate?: AlignmentOptions): number {
        return this.isMirroredAxis(
            this.horizontalDirection(primary),
            this.horizontalDirection(candidate)
        ) ? -offset : offset;
    }

    private resolveVerticalOffset(offset: number, primary?: AlignmentOptions, candidate?: AlignmentOptions): number {
        return this.isMirroredAxis(
            this.verticalDirection(primary),
            this.verticalDirection(candidate)
        ) ? -offset : offset;
    }

    private horizontalDirection(alignment?: AlignmentOptions): number {
        return this.anchorValue(alignment?.reference?.horizontal) - this.anchorValue(alignment?.window?.horizontal);
    }

    private verticalDirection(alignment?: AlignmentOptions): number {
        return this.anchorValue(alignment?.reference?.vertical) - this.anchorValue(alignment?.window?.vertical);
    }

    private anchorValue(anchor?: 'left' | 'top' | 'center' | 'right' | 'bottom'): number {
        switch (anchor) {
            case 'center':
                return 0.5;
            case 'right':
            case 'bottom':
                return 1;
            default:
                return 0;
        }
    }

    private isMirroredAxis(primaryDirection: number, candidateDirection: number): boolean {
        return primaryDirection !== 0 && candidateDirection !== 0 && Math.sign(primaryDirection) !== Math.sign(candidateDirection);
    }

    private calculateOverflow(offset: Offset, width: number, height: number, padding: number): number {
        const viewportTop = (window.scrollY ?? document.documentElement.scrollTop) + padding;
        const viewportLeft = (window.scrollX ?? document.documentElement.scrollLeft) + padding;
        const viewportRight = viewportLeft + window.innerWidth - (padding * 2);
        const viewportBottom = viewportTop + window.innerHeight - (padding * 2);

        return Math.max(0, viewportLeft - offset.left)
            + Math.max(0, viewportTop - offset.top)
            + Math.max(0, (offset.left + width) - viewportRight)
            + Math.max(0, (offset.top + height) - viewportBottom);
    }
}
