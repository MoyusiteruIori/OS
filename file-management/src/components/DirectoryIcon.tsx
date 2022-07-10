import { seqEndsWith } from "../utils";
import CopyrightRoundedIcon from "@mui/icons-material/CopyrightRounded";
import CssRoundedIcon from "@mui/icons-material/CssRounded";
import FileOpenRoundedIcon from "@mui/icons-material/FileOpenRounded";
import AudioFileRoundedIcon from "@mui/icons-material/AudioFileRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import TextSnippetRoundedIcon from "@mui/icons-material/TextSnippetRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

function DirectoryIcons(
  filename: string,
  type: "File" | "Folder"
): JSX.Element {
  if (type === "Folder") return <FolderRoundedIcon />;
  if (seqEndsWith(filename, ".txt")) return <TextSnippetRoundedIcon />;
  if (seqEndsWith(filename, ".exe")) return <TerminalRoundedIcon />;
  if (
    seqEndsWith(filename, ".c") ||
    seqEndsWith(filename, ".cpp") ||
    seqEndsWith(filename, ".cxx") ||
    seqEndsWith(filename, ".cc")
  )
    return <CopyrightRoundedIcon />;
  if (seqEndsWith(filename, ".css")) return <CssRoundedIcon />;
  if (
    seqEndsWith(filename, ".mp3") ||
    seqEndsWith(filename, ".wav") ||
    seqEndsWith(filename, ".wma")
  )
    return <AudioFileRoundedIcon />;
  if (
    seqEndsWith(filename, ".mp4") ||
    seqEndsWith(filename, ".avi") ||
    seqEndsWith(filename, ".wmv") ||
    seqEndsWith(filename, ".rmvb") ||
    seqEndsWith(filename, ".mov")
  )
    return <VideoLibraryRoundedIcon />;
  if (
    seqEndsWith(filename, ".jpg") ||
    seqEndsWith(filename, ".jpeg") ||
    seqEndsWith(filename, ".png") ||
    seqEndsWith(filename, ".gif") ||
    seqEndsWith(filename, ".raw")
  )
    return <ImageRoundedIcon />;

  return <FileOpenRoundedIcon />;
}

export { DirectoryIcons };
