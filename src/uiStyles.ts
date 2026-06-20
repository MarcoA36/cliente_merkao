import type { OrderStatus } from "./types";

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

export const shell = "min-h-screen bg-merkao-background font-sans text-merkao-text";

export const brandBlock = "flex items-center gap-2.5 px-1 pb-3 pt-0.5";
export const brandBlockCompact = "flex items-center gap-2.5 pb-1.5";
export const brandMark =
  "flex h-[34px] w-[34px] items-center justify-center rounded-merkao bg-merkao-primarySoft text-merkao-primary";
export const brandTitle = "m-0 text-base leading-[1.1]";
export const brandSubtitle = "mb-0 mt-[3px] text-[11px] font-semibold text-merkao-muted";

export const buttonBase =
  "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-merkao px-3 py-2 text-[13px] font-extrabold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-[.55]";
export const primaryButton = cn(buttonBase, "border border-merkao-primary bg-merkao-primary text-white hover:bg-merkao-primaryDark");
export const secondaryButton = cn(buttonBase, "border border-merkao-border bg-white text-merkao-text hover:bg-merkao-surfaceAlt");
export const ghostButton = cn(
  buttonBase,
  "col-span-full justify-start border-0 bg-transparent text-merkao-muted hover:bg-merkao-surfaceAlt hover:text-merkao-text"
);
export const smallButton = "!min-h-[31px] !px-[9px] !py-[5px] !text-xs";
export const secondaryIconButton = cn(secondaryButton, "w-[38px] !px-0");
export const iconButton =
  "inline-flex h-[34px] w-[34px] items-center justify-center rounded-merkao border-0 bg-transparent p-0 text-merkao-muted transition-colors duration-150 hover:bg-merkao-surfaceAlt hover:text-merkao-text disabled:cursor-not-allowed disabled:opacity-[.55]";
export const dangerIconButton = cn(
  iconButton,
  "!bg-merkao-dangerSoft !text-merkao-danger hover:!bg-merkao-dangerSoft hover:!text-merkao-danger"
);

export const fieldLabel = "grid gap-1.5 text-xs font-bold text-merkao-muted";
export const fieldInput =
  "min-h-[38px] w-full rounded-merkao border border-merkao-outline bg-white px-2.5 py-2 text-merkao-text outline-none transition-[border-color,box-shadow] duration-150 focus:border-merkao-secondary focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]";
export const fieldTextarea = cn(fieldInput, "!min-h-24 resize-y");
export const compactInput = cn(fieldInput, "max-w-[140px] max-[520px]:max-w-none");
export const fileInput =
  "w-full rounded-merkao border border-dashed border-merkao-outline bg-merkao-background px-2.5 py-2 text-xs text-merkao-muted file:mr-3 file:rounded-md file:border-0 file:bg-merkao-primary file:px-3 file:py-1.5 file:text-xs file:font-extrabold file:text-white";
export const searchInput =
  "min-h-9 w-full border-0 bg-transparent p-0 text-sm text-merkao-text outline-none placeholder:text-merkao-muted focus:shadow-none";
export const checkLabel = "inline-flex items-center gap-2 text-xs font-bold text-merkao-muted";
export const checkbox = "h-4 w-4 accent-merkao-primary";

export const avatarBadgeBase =
  "flex items-center justify-center rounded-full border border-[#cdeedd] bg-merkao-primarySoft text-[11px] font-black text-merkao-primary";
export const avatarBadge = cn(avatarBadgeBase, "h-8 w-8");
export const avatarBadgeLarge = cn(avatarBadgeBase, "h-[38px] w-[38px]");

export const mobileHeader =
  "fixed inset-x-0 top-0 z-50 hidden h-[58px] items-center justify-between border-b border-merkao-border bg-white px-3 max-[860px]:flex";
export const mobileHeaderTitle = "text-[15px]";
export const mobileHeaderActions = "flex items-center gap-1.5";
export const drawerOverlayBase =
  "fixed inset-0 z-[55] hidden border-0 bg-[rgba(17,24,39,0.42)] opacity-0 transition-opacity duration-150 max-[860px]:block";
export const drawerOverlayOpen = "pointer-events-auto !opacity-100";
export const drawerOverlayClosed = "pointer-events-none";
export const sidebarBase =
  "fixed bottom-0 left-0 top-0 z-[60] flex w-64 flex-col gap-[18px] border-r border-merkao-border bg-white px-3.5 py-[18px] max-[860px]:w-[min(280px,86vw)] max-[860px]:shadow-[20px_0_44px_rgba(17,24,39,0.16)] max-[860px]:transition-transform max-[860px]:duration-200";
export const sidebarOpen = "max-[860px]:translate-x-0";
export const sidebarClosed = "max-[860px]:-translate-x-full";
export const nav = "grid gap-1";
export const navButtonBase =
  "inline-flex min-h-[38px] w-full items-center justify-start gap-2 rounded-merkao border-0 bg-transparent px-3 py-2 text-[13px] font-extrabold text-merkao-muted transition-colors duration-150 hover:bg-[#e9e5ff] hover:text-merkao-secondary [&_svg]:h-[17px] [&_svg]:w-[17px]";
export const navButtonActive = "bg-[#e9e5ff] text-merkao-secondary";
export const drawerClose = "ml-auto !hidden max-[860px]:!inline-flex";
export const userBox = "mt-auto grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border-t border-merkao-border px-1 pt-3.5";
export const userName = "block overflow-hidden text-ellipsis whitespace-nowrap text-xs";
export const userEmail = "block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold uppercase text-merkao-muted";

export const main = "ml-64 min-h-screen min-w-0 pb-7 max-[860px]:ml-0 max-[860px]:pb-[82px] max-[860px]:pt-[58px]";
export const topbar =
  "sticky top-0 z-40 flex h-[62px] items-center justify-between gap-4 border-b border-merkao-border bg-white px-6 max-[860px]:hidden";
export const topSearch =
  "flex w-full max-w-[420px] items-center gap-2 rounded-merkao border border-merkao-border bg-merkao-background px-2.5 text-merkao-muted";
export const topbarActions = "flex items-center justify-end gap-2.5";
export const notificationButton = "relative";
export const notificationDot = "absolute right-[7px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-merkao-danger";
export const profileButton =
  "inline-flex min-h-[38px] items-center gap-[7px] rounded-merkao border-0 bg-transparent px-2.5 py-2 text-xs font-extrabold text-merkao-muted hover:bg-merkao-surfaceAlt";
export const pageHeader =
  "mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6 pb-4 pt-[22px] max-[860px]:items-start max-[860px]:px-3 max-[860px]:py-3";
export const pageTitle = "m-0 text-3xl leading-[1.15] max-[860px]:text-[22px]";
export const pageSubtitle = "mb-0 mt-[5px] text-[13px] text-merkao-muted max-[860px]:text-xs";
export const pageActions = "flex items-center justify-end gap-2.5 max-[860px]:hidden";

export const summaryGrid =
  "mx-auto grid w-full max-w-[1440px] grid-cols-4 gap-3.5 px-6 pb-4 max-[1180px]:grid-cols-2 max-[860px]:gap-2.5 max-[860px]:px-3 max-[860px]:pb-3";
export const summaryCard =
  "grid min-h-[118px] gap-2.5 rounded-merkao border border-merkao-border bg-white p-4 max-[860px]:min-h-[104px] max-[860px]:p-3";
export const summaryTop = "flex items-center justify-between";
export const summaryIcon = "flex h-[34px] w-[34px] items-center justify-center rounded-merkao [&_svg]:h-[18px] [&_svg]:w-[18px]";
export const summaryTrend = "rounded-full px-[7px] py-[3px] text-[10px] font-black";
export const summaryLabel = "text-[11px] font-black uppercase text-merkao-muted max-[520px]:text-[10px]";
export const summaryValue = "text-2xl leading-none text-merkao-text max-[860px]:text-[21px]";

export type SummaryTone = "success" | "secondary" | "danger" | "neutral";

export const summaryToneClasses: Record<SummaryTone, { card: string; indicator: string }> = {
  success: {
    card: "",
    indicator: "bg-merkao-primarySoft text-merkao-primary"
  },
  secondary: {
    card: "",
    indicator: "bg-merkao-secondarySoft text-merkao-secondary"
  },
  danger: {
    card: "border-l-4 border-l-merkao-danger",
    indicator: "bg-merkao-dangerSoft text-merkao-danger"
  },
  neutral: {
    card: "",
    indicator: "bg-merkao-surfaceAlt text-teal-700"
  }
};

export const pageNotice = "mx-auto mb-3 w-[calc(100%_-_48px)] max-w-[1440px] rounded-merkao px-3 py-2.5 text-[13px] font-extrabold";
export const inlineNotice = "rounded-merkao px-3 py-2.5 text-[13px] font-extrabold";
export const noticeSuccess = "bg-merkao-primarySoft text-merkao-primary";
export const noticeError = "bg-merkao-dangerSoft text-red-700";

export const dashboardGrid =
  "mx-auto grid w-full max-w-[1440px] grid-cols-[minmax(0,1fr)_320px] gap-3.5 px-6 max-[1180px]:grid-cols-1 max-[860px]:px-3";
export const dashboardPrimary = "min-w-0";
export const workArea = "grid gap-3.5";
export const workAreaSplit = "grid grid-cols-[minmax(0,1fr)_320px] items-start gap-3.5 max-[860px]:grid-cols-1";

export const toolbar =
  "flex items-center justify-between gap-3 rounded-merkao border border-merkao-border bg-white p-3 max-[860px]:flex-col max-[860px]:items-stretch";
export const toolbarActions = "flex items-center justify-end gap-2.5 max-[860px]:w-full max-[860px]:flex-col max-[860px]:items-stretch";
export const toolbarMainTitle = "m-0 text-[15px]";
export const toolbarMainText = "mb-0 mt-[3px] text-xs text-merkao-muted";
export const searchBox =
  "flex w-full max-w-[320px] items-center gap-2 rounded-merkao border border-merkao-border bg-merkao-background px-2.5 text-merkao-muted max-[860px]:max-w-none";
export const helperText = "m-0 text-[11px] leading-4 text-merkao-muted";

export const tableWrap = "overflow-auto rounded-merkao border border-merkao-border bg-white";
export const table = "w-full min-w-[860px] border-collapse";
export const th = "border-b border-[#eef0f3] bg-white px-3 py-3 text-left align-middle text-[10px] font-black uppercase text-merkao-muted";
export const td = "border-b border-[#eef0f3] px-3 py-3 text-left align-middle text-[13px] text-merkao-text";
export const tableStrong = "block font-extrabold";
export const productCell = "flex min-w-60 items-center gap-2.5";
export const productImage = "h-[42px] w-[42px] rounded-md border border-merkao-border bg-merkao-surfaceAlt object-cover";
export const catalogImage = "h-9 w-9 rounded-md border border-merkao-border bg-merkao-surfaceAlt object-cover";
export const subtle = "mt-[3px] block text-[11px] text-merkao-muted";
export const actions = "flex items-center justify-end gap-[7px] whitespace-nowrap";
export const actionsWide = cn(actions, "min-w-[225px]");
export const lineItem = "my-0.5 block";
export const emptyCell = cn(td, "py-8 text-center !text-merkao-muted");

export const pillBase = "inline-flex rounded-full px-2 py-1 text-[10px] font-black";
export const pillOk = cn(pillBase, "bg-merkao-primarySoft text-merkao-primary");
export const pillMuted = cn(pillBase, "bg-merkao-surfaceAlt text-merkao-muted");
export const pillSecondary = cn(pillBase, "bg-merkao-secondarySoft text-merkao-secondary");

const statusPillClasses: Record<OrderStatus, string> = {
  PENDING: "bg-merkao-secondarySoft text-merkao-secondary",
  PREPARING: "bg-[#fff4e6] text-amber-700",
  ON_THE_WAY: "bg-sky-100 text-sky-700",
  DELIVERED: "bg-merkao-primarySoft text-merkao-primary",
  CANCELLED: "bg-merkao-dangerSoft text-red-700"
};

export function statusPill(status: OrderStatus) {
  return cn(pillBase, statusPillClasses[status]);
}

export const operationalRail = "grid min-w-0 gap-3.5 max-[1180px]:grid-cols-2 max-[860px]:grid-cols-1";
export const railCard = "overflow-hidden rounded-merkao border border-merkao-border bg-white";
export const railHeader = "flex min-h-12 items-center justify-between gap-2.5 border-b border-[#eef0f3] px-3 py-[11px]";
export const railHeaderTitle = "m-0 inline-flex items-center gap-[7px] text-sm";
export const alertBadge = "rounded-md bg-merkao-dangerSoft px-1.5 py-[3px] text-[9px] font-black uppercase text-merkao-danger";
export const railList = "grid p-1";
export const stockItem = "grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-[9px] p-2";
export const stockImage = "h-[38px] w-[38px] rounded-md bg-merkao-surfaceAlt object-cover";
export const stockName = "block overflow-hidden text-ellipsis whitespace-nowrap text-xs";
export const stockMeta = "block overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-merkao-muted";
export const stockCount = "text-[11px] text-merkao-danger";
export const railEmpty = "m-0 p-3.5 text-[13px] text-merkao-muted";
export const replenishButton =
  "mx-3 mb-3 mt-2.5 min-h-9 w-[calc(100%_-_24px)] rounded-merkao border-0 bg-merkao-secondary text-xs font-black text-white";
export const activityChart = "flex h-[116px] items-end gap-[9px] px-6 pb-2 pt-5 max-[860px]:h-[98px]";
export const activityBar = "flex-1 rounded-t bg-[#b7ddd1]";
export const activityBarActive = "flex-1 rounded-t bg-merkao-primary";
export const activityLabels = "flex justify-between px-5 pb-3.5 text-[9px] font-black uppercase text-merkao-muted";
export const mobileOrdersCard = cn(railCard, "hidden max-[860px]:block");
export const orderCards = "grid gap-2 p-2.5";
export const orderCard = "flex items-center justify-between rounded-merkao bg-merkao-background p-2.5";
export const orderCardMeta = "block text-[11px] text-merkao-muted";

export const panelSurface = "rounded-merkao border border-merkao-border bg-white";
export const drawer =
  "fixed bottom-0 right-0 top-0 z-[80] grid w-[min(440px,100vw)] max-w-[440px] gap-3.5 overflow-auto rounded-merkao border border-merkao-border bg-white p-4 shadow-[-16px_0_36px_rgba(17,24,39,0.14)]";
export const sidePanel = cn(panelSurface, "grid gap-3.5 p-4");
export const panelHeader = "flex items-center justify-between gap-3";
export const panelTitle = "m-0 text-base";
export const fieldGrid = "grid grid-cols-2 gap-3 max-[860px]:grid-cols-1";
export const formSection = "grid gap-2 rounded-merkao border border-merkao-border bg-merkao-background p-3";
export const formSectionTitle = "m-0 text-xs font-black uppercase text-merkao-muted";
export const listPanel = "grid gap-2 rounded-merkao border border-merkao-border bg-white p-3";
export const listRow = "flex items-center justify-between gap-2 rounded-merkao bg-merkao-background px-3 py-2";
export const imagePreview = "h-16 w-16 rounded-merkao border border-merkao-border bg-merkao-surfaceAlt object-cover";
export const imageUploadRow = "flex items-center gap-3";
export const inlineIcon = "inline align-[-2px]";
export const promoProductList = "grid max-h-48 gap-1 overflow-auto rounded-merkao border border-merkao-border bg-white p-2";
export const loginPage = "flex min-h-screen items-center bg-merkao-background p-5";
export const loginPanel = cn(panelSurface, "mx-auto grid w-full max-w-[380px] gap-3.5 p-4 shadow-[0_18px_50px_rgba(17,24,39,0.08)]");

export const bottomBar =
  "fixed inset-x-0 bottom-0 z-[45] hidden h-16 items-center justify-around border-t border-merkao-border bg-white px-2 pb-[7px] pt-[5px] max-[860px]:flex";
export const bottomBarButton =
  "flex min-w-[58px] flex-col items-center gap-0.5 rounded-merkao border-0 bg-transparent px-2 py-1.5 text-[10px] font-black text-merkao-muted";
export const bottomBarButtonActive = "bg-merkao-primarySoft text-merkao-primary";
