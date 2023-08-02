import CategoryIcon from "@mui/icons-material/Category";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SettingsIcon from '@mui/icons-material/Settings';
import PublishIcon from '@mui/icons-material/Publish';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const menu = [
  {
    title: "Categories",
    icon: <CategoryIcon />,
    path: "/",
  },
  {
    title: "Content Censorship",
    icon: <FactCheckIcon />,
    path: "/content-censorship",
  },
  {
    title: "Setting",
    icon: <SettingsIcon />,
    path: "/setting",
  },
  {
    title: "Import",
    icon: <PublishIcon />,
    path: "/import",
  },
  {
    title: "Export",
    icon: <FileDownloadIcon />,
    path: "/export",
  },
];
