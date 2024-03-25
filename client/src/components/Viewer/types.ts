export interface ToolbarOption {
    title: string;
    Icon: React.ReactNode;
    onClickFunc: () => void;
    isVisible: boolean;
  }
  
export interface ViewerToolbarProps {
    options: ToolbarOption[];
}

export interface ActivityMap {
    name: string;
    checked: boolean;
}
  
export interface Experiment {
name: string;
activityMaps: ActivityMap[];
}

export interface StatisticalMapsPopoverProps {
id: string;
open: boolean;
anchorEl: HTMLButtonElement | null;
onClose: () => void;
experiments: Experiment[];
onActivityMapChange: (experimentName: string, mapName: string, checked: boolean) => void;
}