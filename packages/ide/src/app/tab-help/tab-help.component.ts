import { NestedTreeControl } from "@angular/cdk/tree";
import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, EventEmitter, inject, NgZone, OnDestroy, OnInit, Output } from "@angular/core";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { GoogleAnalyticsService } from "ngx-google-analytics";
import { Subscription } from "rxjs";

import { ResponsiveService } from "../responsive.service";
import { ThemeService } from "../theme.service";

type PortugolWindow = Window & {
  portugol: { abrirExemplo(contents: string, name: string): void };
};

interface TreeItem {
  id: string;
  text: string;
  href: string;
  children?: TreeItem[];
}

// eslint-disable-next-line @angular-eslint/prefer-standalone
@Component({
  standalone: false,
  selector: "app-tab-help",
  templateUrl: "./tab-help.component.html",
  styleUrl: "./tab-help.component.scss",
})
export class TabHelpComponent implements OnInit, OnDestroy, AfterViewInit {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private ngZone = inject(NgZone);
  private gaService = inject(GoogleAnalyticsService);
  private responsive = inject(ResponsiveService);
  private themeService = inject(ThemeService);

  _responsive$?: Subscription;
  _theme$?: Subscription;

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  treeControl = new NestedTreeControl<TreeItem>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeItem>();
  current?: TreeItem;
  currentUrl?: SafeResourceUrl;

  isBelowMd = false;
  isLightTheme = false;

  @Output() newTab = new EventEmitter();

  ngOnInit() {
    (window as unknown as PortugolWindow).portugol = {
      abrirExemplo: (contents: string, name: string) => {
        this.ngZone.run(() => {
          this.newTab.emit({
            name,
            contents,
          });
        });
      },
    };

    this.http.get<TreeItem[]>("assets/recursos/ajuda/scripts/topicos.json").subscribe({
      next: ajuda => {
        this.dataSource.data = ajuda;
        this.treeControl.expand(ajuda[0]);
        this.loadItem(ajuda[0]);
      },
      error: () => {
        // TODO: tratar erro
      },
    });

    this._theme$ = this.themeService.theme.subscribe(theme => {
      this.isLightTheme = theme === "light";
    });
  }

  ngOnDestroy() {
    this._responsive$?.unsubscribe();
  }

  ngAfterViewInit() {
    this._responsive$ = this.responsive.isBelowMd().subscribe(isBelowMd => {
      this.isBelowMd = isBelowMd.matches;
    });
  }

  hasChildren(_: number, item: TreeItem) {
    return item.children?.length ?? 0;
  }

  loadItem(item: TreeItem) {
    this.gaService.event("help_navigation", "Ajuda", item.href);
    this.current = item;
    this.currentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`assets/recursos/ajuda/${item.href}`);
  }
}
