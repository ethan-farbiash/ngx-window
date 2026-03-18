import { ApplicationRef, Injector, ComponentRef, EmbeddedViewRef, createComponent } from '@angular/core';
import { WindowContainerComponent } from './window-container.component';

export function installWindowContainer(applicationRef: ApplicationRef, injector: Injector) {

    let windowContainerInstalled = false;

    return (component: ComponentRef<any>) => {
        if (!windowContainerInstalled) {
            let componentRef = createComponent(WindowContainerComponent, { environmentInjector: applicationRef.injector, elementInjector: injector });
            let domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

            applicationRef.attachView(componentRef.hostView);
            document.body.appendChild(domElem);

            windowContainerInstalled = true;
        }
    };
}