import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { WindowComponent } from '../../../../projects/ngx-window/src/public-api';
import { AdaptivePositioningPageComponent } from './adaptive-positioning-page.component';

describe('AdaptivePositioningPageComponent', () => {

    let fixture: ComponentFixture<AdaptivePositioningPageComponent>;
    let component: AdaptivePositioningPageComponent;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdaptivePositioningPageComponent,
                MockComponent(WindowComponent)
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdaptivePositioningPageComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    it('renders the adaptive positioning page container', () => {
        fixture.detectChanges();

        expect(element.query(By.css('div.adaptive-positioning-page')) !== null).toBeTruthy();
    });

    it('renders a draggable reference element', () => {
        fixture.detectChanges();

        const referenceElement = element.query(By.css('.stage .reference'));

        expect(referenceElement.attributes['draggable']).toEqual('true');
    });

    it('configures the demo window with adaptive positioning enabled', () => {
        fixture.detectChanges();

        const windowElement = element.query(By.css('ngx-window.adaptive-window'));
        const windowComponent = windowElement.componentInstance as WindowComponent;

        expect(windowComponent.topOffset).toEqual(14);
        expect(windowComponent.leftOffset).toEqual(12);
        expect(windowComponent.options.adaptivePosition).toEqual({
            viewportPadding: 24,
            placements: [
                {
                    alignment: {
                        reference: {
                            vertical: 'top'
                        },
                        window: {
                            vertical: 'bottom'
                        }
                    }
                },
                {
                    alignment: {
                        reference: {
                            vertical: 'center'
                        },
                        window: {
                            horizontal: 'right',
                            vertical: 'center'
                        }
                    },
                    leftOffset: -18,
                    topOffset: 0
                },
                {
                    alignment: {
                        reference: {
                            horizontal: 'right',
                            vertical: 'center'
                        },
                        window: {
                            vertical: 'center'
                        }
                    },
                    leftOffset: 18,
                    topOffset: 0
                }
            ]
        });
    });

    it('updates the reference element position while dragging', () => {
        fixture.detectChanges();

        const referenceElement = element.query(By.css('.reference'));
        referenceElement.triggerEventHandler('dragstart', { x: 100, y: 200 });
        referenceElement.triggerEventHandler('drag', { x: 120, y: 215 });

        expect(referenceElement.styles['left']).toEqual('20px');
        expect(referenceElement.styles['top']).toEqual('15px');
    });

    it('prevents the default drag over behavior so dragging can continue inside the stage', () => {
        const eventMock = new Event('dragover');
        jest.spyOn(eventMock, 'preventDefault');
        fixture.detectChanges();

        element.query(By.css('.adaptive-positioning-page')).triggerEventHandler('dragover', eventMock);

        expect(eventMock.preventDefault).toHaveBeenCalled();
    });
});
