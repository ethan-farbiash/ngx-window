import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { filter, map, mergeWith, Subscription, tap } from 'rxjs';
import { ElementPositionService } from './element-position.service';
import { WindowService } from './window.service';
import { WindowPlacementService } from './window-placement.service';
import { Offset, WindowOptions } from './window.types';

@Component({
    selector: 'ngx-window',
    templateUrl: './window.component.html',
    styleUrls: ['./window.component.scss'],
    standalone: false
})
export class WindowComponent implements OnInit, AfterContentChecked, OnDestroy {

    @ViewChild('template', { static: true })
    private template!: TemplateRef<any>;

    @Input() width?: number;
    @Input() height?: number;
    @Input() topOffset: number = 0;
    @Input() leftOffset: number = 0;
    @Input() options: WindowOptions = {};
    @Input() refElement?: HTMLElement;

    @Output() visibleChange = new EventEmitter<boolean>();

    private _openSubscription?: Subscription;
    private _moveSubscription?: Subscription;

    private _openedAtLeastOnce: boolean = false;
    private _measuredHeight?: number;
    private _measuredWidth?: number;
    private _measureOnOpen: boolean = false;
    private _windowResizeObserver?: ResizeObserver;

    private _id?: number;
    get id() { return this._id; }

    get top() {
        return this.round(this.resolveOffset().top);
    }

    get left() {
        return this.round(this.resolveOffset().left);
    }

    get visibility() {
        return this._measureOnOpen ? 'hidden' : null;
    }

    constructor(private windowService: WindowService, private elementPositionService: ElementPositionService,
        private windowPlacementService: WindowPlacementService, private elementRef: ElementRef,
        private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) { }

    ngOnInit() {
        this._id = this.windowService.registerWindow(this.elementRef, this.refElement, this.options.visibility?.keepOpen);

        const opened$ = this.windowService.windowOpened$.pipe(filter(id => id === this._id), map(() => true));
        const closed$ = this.windowService.windowClosed$.pipe(filter(id => id === this._id), map(() => false));
        const moved$ = this.windowService.windowMoved$.pipe(filter(id => id === this._id), map(() => true));

        this._openSubscription = opened$.pipe(
            tap(() => {
                this._openedAtLeastOnce = true;
                this.onWindowOpened();
            }),
            mergeWith(closed$)
        ).subscribe(visible => {
            if (!visible) {
                this.onWindowClosed();
            }

            this.visibleChange.emit(visible);
        });
        this._moveSubscription = moved$.subscribe(() => {
            if (this.windowService.isOpen(this._id!)) {
                this.ngZone.run(() => {
                    this.measureWindow();
                    this.changeDetectorRef.detectChanges();
                });
            }
        });
    }

    ngAfterContentChecked() {
        if (this.options.visibility?.startOpen && !this._openedAtLeastOnce) {
            this.open();
        }
    }

    ngOnDestroy() {
        this._openSubscription?.unsubscribe();
        this._moveSubscription?.unsubscribe();
        this.disconnectWindowResizeObserver();
    }

    @HostListener('window:resize')
    onWindowResize() {
        if (this.windowService.isOpen(this._id!)) {
            this.measureWindow();
            this.changeDetectorRef.detectChanges();
        }
    }

    open() {
        this._measureOnOpen = this.width === undefined || this.height === undefined;

        if (!this._measureOnOpen) {
            this.measureWindow();
        }

        this.windowService.open(this._id!, this.template);
    }

    close() {
        this.windowService.close(this._id!);
    }

    toggle() {
        if (!this.windowService.isOpen(this._id!)) {
            this.open();
        } else {
            this.close();
        }
    }

    private onWindowOpened() {
        this.measureWindow();
        this.startWindowResizeObserver();
        this.changeDetectorRef.detectChanges();
    }

    private onWindowClosed() {
        this._measureOnOpen = false;
        this.disconnectWindowResizeObserver();
    }

    private resolveOffset(): Offset {
        return this.windowPlacementService.resolve({
            alignment: this.options.alignment,
            adaptivePlacements: this.options.adaptivePosition?.placements,
            height: this.height ?? this._measuredHeight ?? 0,
            leftOffset: this.leftOffset,
            referencePosition: this.refElement ? this.elementPositionService.getPosition(this.refElement) : undefined,
            topOffset: this.topOffset,
            viewportPadding: this.options.adaptivePosition?.viewportPadding,
            width: this.width ?? this._measuredWidth ?? 0
        });
    }

    private round(value: number) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }

    private measureWindow() {
        const windowElement = this._id !== undefined ? this.windowService.getWindowElement(this._id) : undefined;

        if (!windowElement) {
            return;
        }

        const rect = windowElement.getBoundingClientRect();

        if (this.width === undefined) {
            this._measuredWidth = rect.width;
        }

        if (this.height === undefined) {
            this._measuredHeight = rect.height;
        }

        if ((this.width !== undefined || this._measuredWidth !== undefined)
            && (this.height !== undefined || this._measuredHeight !== undefined)) {
            this._measureOnOpen = false;
        }
    }

    private startWindowResizeObserver() {
        if (this.width !== undefined && this.height !== undefined) {
            return;
        }

        const windowElement = this._id !== undefined ? this.windowService.getWindowElement(this._id) : undefined;

        if (!windowElement || typeof ResizeObserver === 'undefined') {
            return;
        }

        this.disconnectWindowResizeObserver();
        this._windowResizeObserver = new ResizeObserver(() => {
            this.ngZone.run(() => {
                this.measureWindow();
                this.changeDetectorRef.detectChanges();
            });
        });
        this._windowResizeObserver.observe(windowElement);
    }

    private disconnectWindowResizeObserver() {
        this._windowResizeObserver?.disconnect();
        this._windowResizeObserver = undefined;
    }
}
