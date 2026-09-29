import { ComicBook, ComicPanel, LayoutStyle } from '../types/comic';

export interface PanelBounds {
  panelIndex: number;
  x: number; // percentage 0-100 or mm
  y: number;
  width: number;
  height: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface PageLayout {
  pageIndex: number;
  panels: Array<{
    panel: ComicPanel;
    bounds: PanelBounds;
  }>;
}

/**
 * Calculates responsive panel positioning and layout bindings for both screen preview and print/PDF output
 */
export function buildComicLayout(comic: ComicBook): PageLayout[] {
  const { panels, layoutStyle } = comic;
  if (!panels || panels.length === 0) return [];

  switch (layoutStyle) {
    case 'strip-4': {
      // 1 page with 4 panels arranged horizontally or vertically
      return [
        {
          pageIndex: 0,
          panels: panels.slice(0, 4).map((p, idx) => ({
            panel: p,
            bounds: {
              panelIndex: idx,
              x: 0,
              y: idx * 25,
              width: 100,
              height: 23,
            },
          })),
        },
      ];
    }

    case 'graphic-6': {
      // 6-panel layout: Page with 2 columns x 3 rows
      const pages: PageLayout[] = [];
      const panelsPerPage = 6;
      const totalPages = Math.ceil(panels.length / panelsPerPage);

      for (let pg = 0; pg < totalPages; pg++) {
        const pagePanels = panels.slice(pg * panelsPerPage, (pg + 1) * panelsPerPage);
        const mapped = pagePanels.map((p, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          return {
            panel: p,
            bounds: {
              panelIndex: pg * panelsPerPage + idx,
              x: col === 0 ? 0 : 52,
              y: row * 33.3,
              width: 48,
              height: 31,
            },
          };
        });

        pages.push({
          pageIndex: pg,
          panels: mapped,
        });
      }
      return pages;
    }

    case 'grid-4':
    default: {
      // Standard 4-panel 2x2 grid per page
      const pages: PageLayout[] = [];
      const panelsPerPage = 4;
      const totalPages = Math.ceil(panels.length / panelsPerPage);

      for (let pg = 0; pg < totalPages; pg++) {
        const pagePanels = panels.slice(pg * panelsPerPage, (pg + 1) * panelsPerPage);
        const mapped = pagePanels.map((p, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          return {
            panel: p,
            bounds: {
              panelIndex: pg * panelsPerPage + idx,
              x: col === 0 ? 0 : 52,
              y: row === 0 ? 0 : 52,
              width: 48,
              height: 48,
            },
          };
        });

        pages.push({
          pageIndex: pg,
          panels: mapped,
        });
      }
      return pages;
    }
  }
}
