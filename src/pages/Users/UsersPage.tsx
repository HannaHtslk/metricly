import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Avatar,
  Box,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useGetUsersQuery, type User } from "../../api/usersApi";
import PageHeader from "../../components/ui/PageHeader";
import TableSkeleton from "../../components/ui/TableSkeleton";
import UserDetailDrawer from "./UserDetailDrawer";
import { getAvatarColor } from "./avatarUtils";

type SortKey = "firstName" | "email" | "age" | "country";
type SortDir = "asc" | "desc";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const GenderChip = ({ gender }: { gender: string }) => {
  const isMale = gender === "male";
  return (
    <Chip
      label={isMale ? "Male" : "Female"}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: "0.7rem",
        bgcolor: isMale ? "rgba(96,165,250,0.15)" : "rgba(244,114,182,0.15)",
        color: isMale ? "#3b82f6" : "#ec4899",
        border: "1px solid",
        borderColor: isMale ? "rgba(96,165,250,0.3)" : "rgba(244,114,182,0.3)",
      }}
    />
  );
};

const EmptyState = ({ hasFilters }: { hasFilters: boolean }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 10,
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        bgcolor: "rgba(99,102,241,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.main",
      }}
    >
      <InboxRoundedIcon sx={{ fontSize: 36 }} />
    </Box>
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        No users found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {hasFilters
          ? "Try adjusting your search or filter criteria."
          : "No users are available right now."}
      </Typography>
    </Box>
  </Box>
);

const UsersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data, isLoading, isError } = useGetUsersQuery();

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("firstName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const departments = useMemo(() => {
    if (!data) return [];
    const set = new Set(data.users.map((u) => u.company.department));
    return Array.from(set).sort();
  }, [data]);

  const getValue = (user: User, key: SortKey): string | number => {
    if (key === "firstName")
      return `${user.firstName} ${user.lastName}`.toLowerCase();
    if (key === "email") return user.email.toLowerCase();
    if (key === "age") return user.age;
    if (key === "country") return user.address.country.toLowerCase();
    return "";
  };

  const filteredAndSorted = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    let result = data.users.filter((u) => {
      const nameMatch =
        !q ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const genderMatch = !genderFilter || u.gender === genderFilter;
      const deptMatch = !deptFilter || u.company.department === deptFilter;
      return nameMatch && genderMatch && deptMatch;
    });

    result = [...result].sort((a, b) => {
      const aVal = getValue(a, sortKey);
      const bVal = getValue(b, sortKey);
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, search, genderFilter, deptFilter, sortKey, sortDir]);

  const paginated = useMemo(
    () =>
      filteredAndSorted.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [filteredAndSorted, page, rowsPerPage],
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const hasFilters = !!(search || genderFilter || deptFilter);

  const isDark = theme.palette.mode === "dark";

  const headerCellSx = {
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    color: "text.secondary",
    bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.05)",
    py: 1.5,
  };

  return (
    <>
      <PageHeader
        title="User Directory"
        subtitle={
          data
            ? `${filteredAndSorted.length} of ${data.total} users`
            : "Loading users..."
        }
      >
        <Chip
          icon={<PeopleAltRoundedIcon sx={{ fontSize: "1rem !important" }} />}
          label={data ? `${data.total} total` : "—"}
          sx={{
            fontWeight: 600,
            bgcolor: "rgba(99,102,241,0.1)",
            color: "primary.main",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        />
      </PageHeader>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.1)",
          borderRadius: 3,
          overflow: "hidden",
          background: isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(99,102,241,0.035)",
          }}
        >
          <FilterListRoundedIcon
            sx={{ color: "text.secondary", fontSize: "1.2rem" }}
          />

          <TextField
            size="small"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ flex: "1 1 220px", minWidth: 180, maxWidth: 340 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setPage(0);
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, maxWidth: 220 }}>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setPage(0);
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {hasFilters && (
            <Chip
              label="Clear filters"
              size="small"
              onDelete={() => {
                setSearch("");
                setGenderFilter("");
                setDeptFilter("");
                setPage(0);
              }}
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        {/* Table */}
        <TableContainer>
          {isLoading ? (
            <TableSkeleton rowCount={10} columns={5} />
          ) : isError ? (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <Typography color="error" fontWeight={500}>
                Failed to load users. Please try again.
              </Typography>
            </Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>
                    <TableSortLabel
                      active={sortKey === "firstName"}
                      direction={sortKey === "firstName" ? sortDir : "asc"}
                      onClick={() => handleSort("firstName")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={headerCellSx}>
                    <TableSortLabel
                      active={sortKey === "email"}
                      direction={sortKey === "email" ? sortDir : "asc"}
                      onClick={() => handleSort("email")}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...headerCellSx,
                      display: { xs: "none", sm: "table-cell" },
                    }}
                  >
                    <TableSortLabel
                      active={sortKey === "age"}
                      direction={sortKey === "age" ? sortDir : "asc"}
                      onClick={() => handleSort("age")}
                    >
                      Age / Gender
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...headerCellSx,
                      display: { xs: "none", md: "table-cell" },
                    }}
                  >
                    <TableSortLabel
                      active={sortKey === "country"}
                      direction={sortKey === "country" ? sortDir : "asc"}
                      onClick={() => handleSort("country")}
                    >
                      Country
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...headerCellSx,
                      display: { xs: "none", md: "table-cell" },
                    }}
                  >
                    Department
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ border: "none", p: 0 }}>
                      <EmptyState hasFilters={hasFilters} />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((user) => {
                    const initials =
                      `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                    const avatarColor = getAvatarColor(
                      user.firstName + user.lastName,
                    );
                    return (
                      <TableRow
                        key={user.id}
                        hover
                        onClick={() => setSelectedUser(user)}
                        sx={{
                          cursor: "pointer",
                          transition: "background 0.15s",
                          "&:hover": {
                            bgcolor:
                              theme.palette.mode === "light"
                                ? "rgba(99,102,241,0.04)"
                                : "rgba(99,102,241,0.08)",
                          },
                          "&:last-child td": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Avatar
                              src={user.image}
                              sx={{
                                width: 36,
                                height: 36,
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                bgcolor: avatarColor,
                                flexShrink: 0,
                              }}
                            >
                              {initials}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                noWrap
                                sx={{ maxWidth: { xs: 120, sm: 180 } }}
                              >
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: { xs: "block", sm: "none" } }}
                                noWrap
                              >
                                {user.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell
                          sx={{ display: { xs: "none", sm: "table-cell" } }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ maxWidth: 220 }}
                          >
                            {user.email}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{ display: { xs: "none", sm: "table-cell" } }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {user.age}
                            </Typography>
                            <GenderChip gender={user.gender} />
                          </Stack>
                        </TableCell>

                        <TableCell
                          sx={{ display: { xs: "none", md: "table-cell" } }}
                        >
                          <Typography variant="body2">
                            {user.address.country}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{ display: { xs: "none", md: "table-cell" } }}
                        >
                          <Chip
                            label={user.company.department}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.7rem",
                              bgcolor:
                                theme.palette.mode === "light"
                                  ? "rgba(34,211,238,0.1)"
                                  : "rgba(34,211,238,0.15)",
                              color:
                                theme.palette.mode === "light"
                                  ? "#0891b2"
                                  : "#22d3ee",
                              border: "1px solid",
                              borderColor:
                                theme.palette.mode === "light"
                                  ? "rgba(34,211,238,0.25)"
                                  : "rgba(34,211,238,0.3)",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        {!isLoading && !isError && filteredAndSorted.length > 0 && (
          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(99,102,241,0.035)",
            }}
          >
            <TablePagination
              component="div"
              count={filteredAndSorted.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={isMobile ? [] : ROWS_PER_PAGE_OPTIONS}
              labelRowsPerPage={isMobile ? "" : "Rows per page:"}
              sx={{
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    fontSize: "0.8rem",
                    color: "text.secondary",
                  },
                // Hide the rows-per-page select entirely on mobile to prevent overflow
                ".MuiTablePagination-input": {
                  display: isMobile ? "none" : undefined,
                },
              }}
            />
          </Box>
        )}
      </Paper>

      <UserDetailDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
};

export default UsersPage;
