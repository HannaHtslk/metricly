import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { User } from "../../api/usersApi";
import { getAvatarColor } from "./avatarUtils";

interface UserDetailDrawerProps {
  user: User | null;
  onClose: () => void;
}

// Fixed pixel width used only at sm+; xs falls back to 92vw to avoid viewport overflow
const DRAWER_WIDTH = 340;

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailRow = ({ icon, label, value }: DetailRowProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)",
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

const UserDetailDrawer = ({ user, onClose }: UserDetailDrawerProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "";
  const avatarColor = user
    ? getAvatarColor(user.firstName + user.lastName)
    : "#6366f1";
  const isMale = user?.gender === "male";

  return (
    <Drawer
      anchor="right"
      open={!!user}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "92vw", sm: DRAWER_WIDTH },
            background: isDark
              ? "rgba(10,15,30,0.80)"
              : "rgba(255,255,255,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderLeft: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          },
        },
      }}
    >
      {user && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.4)",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              User Profile
            </Typography>
            <IconButton onClick={onClose} aria-label="Close user detail panel">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Avatar + name banner */}
          <Box
            sx={{
              p: 3,
              bgcolor: isDark
                ? "rgba(99,102,241,0.12)"
                : "rgba(99,102,241,0.06)",
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              src={user.image}
              sx={{
                width: 72,
                height: 72,
                fontSize: "1.5rem",
                fontWeight: 700,
                bgcolor: avatarColor,
                border: "3px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700}>
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={isMale ? "Male" : "Female"}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: isMale
                    ? "rgba(96,165,250,0.15)"
                    : "rgba(244,114,182,0.15)",
                  color: isMale ? "#3b82f6" : "#ec4899",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  border: "1px solid",
                  borderColor: isMale
                    ? "rgba(96,165,250,0.3)"
                    : "rgba(244,114,182,0.3)",
                }}
              />
            </Box>
          </Box>

          {/* Details */}
          <Box
            sx={{
              p: 3,
              flexGrow: 1,
              overflowY: "auto",
              background: "transparent",
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={600}
              sx={{ letterSpacing: 1 }}
            >
              Contact
            </Typography>
            <Stack divider={<Divider flexItem />} sx={{ mt: 0.5 }}>
              <DetailRow
                icon={<EmailRoundedIcon fontSize="small" />}
                label="Email"
                value={user.email}
              />
              <DetailRow
                icon={<CakeRoundedIcon fontSize="small" />}
                label="Age"
                value={`${user.age} years old`}
              />
            </Stack>

            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={600}
              sx={{ letterSpacing: 1, mt: 3, display: "block" }}
            >
              Location & Work
            </Typography>
            <Stack divider={<Divider flexItem />} sx={{ mt: 0.5 }}>
              <DetailRow
                icon={<WcRoundedIcon fontSize="small" />}
                label="Gender"
                value={isMale ? "Male" : "Female"}
              />
              <DetailRow
                icon={<LocationOnRoundedIcon fontSize="small" />}
                label="Country"
                value={user.address.country}
              />
              <DetailRow
                icon={<WorkRoundedIcon fontSize="small" />}
                label="Department"
                value={user.company.department}
              />
            </Stack>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: isDark
                  ? "rgba(99,102,241,0.12)"
                  : "rgba(99,102,241,0.06)",
                border: "1px solid",
                borderColor: isDark
                  ? "rgba(99,102,241,0.25)"
                  : "rgba(99,102,241,0.15)",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary">
                #{String(user.id).padStart(4, "0")}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default UserDetailDrawer;
