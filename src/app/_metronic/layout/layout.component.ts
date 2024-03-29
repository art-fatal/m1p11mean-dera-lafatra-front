import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit, OnDestroy,
} from "@angular/core";
import { LayoutService } from "./core/layout.service";
import { LayoutInitService } from "./core/layout-init.service";
import { SidebarService } from "./core/sidebar.service";
import {Observable, Subscription} from "rxjs";
import { PageInfoService } from "./core/page-info.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  // Public variables
  contentContainerClasses = "";
  toolbarDisplay = true;
  asideCSSClasses: string;
  headerFixedDesktop?: boolean = false;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  showSidebar$: Observable<boolean>;
  // offcanvases
  asideDisplay: boolean;
  title$: Observable<string>;
  private unsubscribe: Subscription[] = [];

  @ViewChild("ktAside", { static: true }) ktAside: ElementRef;
  @ViewChild("ktHeaderMobile", { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild("ktHeader", { static: true }) ktHeader: ElementRef;

  constructor(
    private initService: LayoutInitService,
    private layout: LayoutService,
    private sidebar: SidebarService,
    private pageInfo: PageInfoService,
  ) {
    this.initService.init();
    this.showSidebar$ = this.sidebar.sidebarState.asObservable();
    const layoutSubscriber = this.layout.layoutConfigSubject.asObservable().subscribe(() => {
      this.buildView()
    })
    this.unsubscribe.push(layoutSubscriber)
  }

  ngOnInit(): void {
    // build view by layout config settings
    this.buildView()
    this.title$ = this.pageInfo.title.asObservable();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  ngAfterViewInit(): void {
    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[key] =
            this.headerHTMLAttributes[key];
        }
      }
    }
  }

  private buildView() {
    this.initService.initBaseLayout();
    this.asideDisplay = this.layout.getProp("aside.display") as boolean;
    this.toolbarDisplay = this.layout.getProp("toolbar.display") as boolean;
    this.headerFixedDesktop = this.layout.getProp("header.fixed.desktop") as
        | boolean
        | undefined;
    this.contentContainerClasses =
        this.layout.getStringCSSClasses("contentContainer");
    this.asideCSSClasses = this.layout.getStringCSSClasses("aside");
    this.headerCSSClasses = this.layout.getStringCSSClasses("header");
    this.headerHTMLAttributes = this.layout.getHTMLAttributes("headerMenu");
    this.footerCSSClasses = this.layout.getStringCSSClasses("footer");
  }
}
