import { TestBed } from '@angular/core/testing';
import { AlignmentService } from './alignment.service';
import { Position } from './window.types';
import { WindowPlacementService } from './window-placement.service';

describe('WindowPlacementService', () => {

    let service: WindowPlacementService;
    let referencePosition: Position;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AlignmentService,
                WindowPlacementService
            ]
        });

        service = TestBed.inject(WindowPlacementService);
        referencePosition = { top: 400, left: 500, width: 100, height: 40 };

        window.innerWidth = 1200;
        window.innerHeight = 900;
        Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    });

    it('returns the primary placement when adaptive positioning is omitted', () => {
        const offset = service.resolve({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            height: 200,
            leftOffset: 20,
            referencePosition,
            topOffset: 10,
            width: 300
        });

        expect(offset).toEqual({ top: 450, left: 520 });
    });

    it('keeps the primary placement when it fits', () => {
        const offset = service.resolve({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    }
                }
            ],
            height: 200,
            leftOffset: 0,
            referencePosition,
            topOffset: 8,
            width: 250
        });

        expect(offset).toEqual({ top: 448, left: 500 });
    });

    it('selects the first fallback placement that fits in the viewport', () => {
        const offset = service.resolve({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    }
                }
            ],
            height: 350,
            leftOffset: 0,
            referencePosition: { ...referencePosition, top: 700 },
            topOffset: 12,
            width: 250
        });

        expect(offset).toEqual({ top: 338, left: 500 });
    });

    it('mirrors inherited offsets when the placement flips to the opposite side', () => {
        const offset = service.resolve({
            alignment: {
                reference: { horizontal: 'right', vertical: 'bottom' },
                window: { horizontal: 'left', vertical: 'top' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'left', vertical: 'top' },
                        window: { horizontal: 'right', vertical: 'bottom' }
                    }
                }
            ],
            height: 200,
            leftOffset: 16,
            referencePosition: { ...referencePosition, left: 1100, top: 820 },
            topOffset: 10,
            width: 300
        });

        expect(offset).toEqual({ top: 610, left: 784 });
    });

    it('uses explicitly provided fallback offsets instead of mirrored inherited values', () => {
        const offset = service.resolve({
            alignment: {
                reference: { vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { vertical: 'top' },
                        window: { vertical: 'bottom' }
                    },
                    topOffset: -24
                }
            ],
            height: 350,
            leftOffset: 0,
            referencePosition: { ...referencePosition, top: 700 },
            topOffset: 12,
            width: 250
        });

        expect(offset).toEqual({ top: 326, left: 500 });
    });

    it('chooses the least-overflowing placement when none fit fully', () => {
        const offset = service.resolve({
            alignment: {
                reference: { horizontal: 'right', vertical: 'bottom' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'left', vertical: 'bottom' },
                        window: { horizontal: 'right' }
                    }
                }
            ],
            height: 500,
            leftOffset: 24,
            referencePosition: { top: 700, left: 1120, width: 80, height: 80 },
            topOffset: 24,
            width: 500
        });

        expect(offset).toEqual({ top: 804, left: 596 });
    });

    it('takes viewport padding into account when evaluating fit', () => {
        const offset = service.resolve({
            alignment: {
                reference: { horizontal: 'right' }
            },
            adaptivePlacements: [
                {
                    alignment: {
                        reference: { horizontal: 'left' },
                        window: { horizontal: 'right' }
                    }
                }
            ],
            height: 100,
            leftOffset: 20,
            referencePosition: { ...referencePosition, left: 1035 },
            topOffset: 0,
            viewportPadding: 24,
            width: 150
        });

        expect(offset).toEqual({ top: 400, left: 865 });
    });
});
