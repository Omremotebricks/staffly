"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late" | "half-day";
  checkIn?: string;
  checkOut?: string;
  tasks?: string[];
  meetings?: string[];
  notes?: string;
  location?: string;
}

// Dummy attendance data with additional information
// const dummyAttendanceData: AttendanceRecord[] = [
//   {
//     date: "2025-12-31",
//     status: "present",
//     checkIn: "09:00",
//     checkOut: "17:30",
//     tasks: ["Complete project proposal", "Review code changes"],
//     meetings: ["Team standup - 10:00 AM", "Client call - 2:00 PM"],
//     notes: "Productive day, finished all assigned tasks",
//     location: "Office",
//   },
//   {
//     date: "2025-12-02",
//     status: "late",
//     checkIn: "09:45",
//     checkOut: "17:30",
//     tasks: ["Bug fixes", "Documentation update"],
//     meetings: ["Sprint planning - 11:00 AM"],
//     notes: "Traffic delay in morning",
//     location: "Office",
//   },
//   {
//     date: "2025-12-03",
//     status: "present",
//     checkIn: "08:55",
//     checkOut: "17:25",
//     tasks: ["Database optimization", "Testing new features"],
//     meetings: ["Design review - 3:00 PM"],
//     notes: "Early start, great progress on optimization",
//     location: "Office",
//   },
//   {
//     date: "2025-12-04",
//     status: "absent",
//     notes: "Sick leave - flu symptoms",
//     location: "Home",
//   },
//   {
//     date: "2025-12-05",
//     status: "half-day",
//     checkIn: "09:00",
//     checkOut: "13:00",
//     tasks: ["Emergency bug fix"],
//     meetings: ["Quick team sync - 10:30 AM"],
//     notes: "Doctor appointment in afternoon",
//     location: "Office",
//   },
//   {
//     date: "2025-12-08",
//     status: "present",
//     checkIn: "09:10",
//     checkOut: "17:40",
//     tasks: ["Feature development", "Code review"],
//     meetings: ["Weekly team meeting - 1:00 PM"],
//     notes: "Stayed late to finish feature implementation",
//     location: "Office",
//   },
//   {
//     date: "2025-12-09",
//     status: "present",
//     checkIn: "08:50",
//     checkOut: "17:20",
//     tasks: ["Unit testing", "Performance analysis"],
//     meetings: ["Architecture discussion - 4:00 PM"],
//     notes: "Good progress on testing suite",
//     location: "Remote",
//   },
//   {
//     date: "2025-12-10",
//     status: "late",
//     checkIn: "10:15",
//     checkOut: "17:30",
//     tasks: ["Deployment preparation", "Security audit"],
//     meetings: ["Security review - 2:30 PM"],
//     notes: "Car trouble caused delay",
//     location: "Office",
//   },
//   {
//     date: "2025-12-11",
//     status: "present",
//     checkIn: "09:05",
//     checkOut: "17:35",
//     tasks: ["Production deployment", "Monitor system"],
//     meetings: ["Post-deployment review - 4:30 PM"],
//     notes: "Successful deployment, no issues",
//     location: "Office",
//   },
//   {
//     date: "2025-12-12",
//     status: "present",
//     checkIn: "08:58",
//     checkOut: "17:28",
//     tasks: ["Documentation", "Knowledge sharing"],
//     meetings: ["Team retrospective - 3:00 PM"],
//     notes: "Great week, all milestones achieved",
//     location: "Office",
//   },
// ];
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const generateDummyAttendance = () => {
  const data: AttendanceRecord[] = [];
  const today = new Date();

  const generateMonth = (offset: number) => {
    const base = new Date();
    base.setMonth(base.getMonth() - offset);

    const year = base.getFullYear();
    const month = base.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const isToday = date.toDateString() === new Date().toDateString();

      const rand = Math.random();
      let status: AttendanceRecord["status"] = "present";

      if (!isToday) {
        if (rand < 0.1) status = "absent";
        else if (rand < 0.25) status = "half-day";
        else if (rand < 0.4) status = "late";
      }

      data.push({
        date: formatDate(date),
        status,
        checkIn:
          status === "absent"
            ? undefined
            : status === "late"
            ? "10:15"
            : "09:00",
        checkOut:
          status === "half-day"
            ? "13:00"
            : status === "absent"
            ? undefined
            : "17:30",
        tasks: status === "absent" ? [] : ["Feature work", "Code review"],
        meetings: status === "absent" ? [] : ["Daily standup"],
        notes:
          status === "absent"
            ? "On leave"
            : status === "half-day"
            ? "Left early"
            : status === "late"
            ? "Traffic delay"
            : "Regular workday",
        location: status === "absent" ? "Home" : "Office",
      });
    }
  };

  // ✅ CURRENT + PREVIOUS TWO MONTHS
  generateMonth(0);
  generateMonth(1);
  generateMonth(2);

  return data;
};

export default function AttendanceCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceData] = useState<AttendanceRecord[]>(
    generateDummyAttendance()
  );

  const getAttendanceForDate = (date: Date): AttendanceRecord | undefined => {
    const dateStr = date.toISOString().split("T")[0];
    return attendanceData.find((record) => record.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "late":
        return "bg-yellow-500";
      case "half-day":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "late":
        return "Late";
      case "half-day":
        return "Half Day";
      default:
        return "No Record";
    }
  };

  const tileContent = ({ date }: { date: Date }) => {
    const attendance = getAttendanceForDate(date);
    if (attendance) {
      return (
        <div
          className={`status-dot ${getStatusColor(attendance.status)}`}
        ></div>
      );
    }
    return null;
  };

  const selectedDateAttendance = getAttendanceForDate(selectedDate);

  const getAttendanceStats = () => {
    const present = attendanceData.filter((r) => r.status === "present").length;
    const absent = attendanceData.filter((r) => r.status === "absent").length;
    const late = attendanceData.filter((r) => r.status === "late").length;
    const halfDay = attendanceData.filter(
      (r) => r.status === "half-day"
    ).length;

    return { present, absent, late, halfDay, total: attendanceData.length };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-xl font-semibold">{stats.present}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-xl font-semibold">{stats.absent}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-xl font-semibold">{stats.late}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <div>
              <p className="text-sm text-gray-600">Half Day</p>
              <p className="text-xl font-semibold">{stats.halfDay}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Calendar
          </h3>
          <div className="attendance-calendar">
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              tileContent={tileContent}
              formatShortWeekday={(locale, date) =>
                date.toLocaleDateString("en-IN", { weekday: "short" })
              }
              className="w-full"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Late</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Half Day</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {selectedDateAttendance ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-3 ${getStatusColor(
                    selectedDateAttendance.status
                  )}`}
                ></div>
                <span className="font-medium">
                  {getStatusText(selectedDateAttendance.status)}
                </span>
              </div>

              {selectedDateAttendance.location && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">
                    {selectedDateAttendance.location}
                  </p>
                </div>
              )}

              {selectedDateAttendance.checkIn && (
                <div>
                  <p className="text-sm text-gray-600">Check In</p>
                  <p className="font-medium">
                    {selectedDateAttendance.checkIn}
                  </p>
                </div>
              )}

              {selectedDateAttendance.checkOut && (
                <div>
                  <p className="text-sm text-gray-600">Check Out</p>
                  <p className="font-medium">
                    {selectedDateAttendance.checkOut}
                  </p>
                </div>
              )}

              {selectedDateAttendance.checkIn &&
                selectedDateAttendance.checkOut && (
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="font-medium">
                      {(() => {
                        const checkIn = new Date(
                          `2024-01-01 ${selectedDateAttendance.checkIn}`
                        );
                        const checkOut = new Date(
                          `2024-01-01 ${selectedDateAttendance.checkOut}`
                        );
                        const diff =
                          (checkOut.getTime() - checkIn.getTime()) /
                          (1000 * 60 * 60);
                        return `${diff.toFixed(1)} hours`;
                      })()}
                    </p>
                  </div>
                )}

              {selectedDateAttendance.tasks &&
                selectedDateAttendance.tasks.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tasks</p>
                    <ul className="space-y-1">
                      {selectedDateAttendance.tasks.map((task, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedDateAttendance.meetings &&
                selectedDateAttendance.meetings.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Meetings</p>
                    <ul className="space-y-1">
                      {selectedDateAttendance.meetings.map((meeting, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-blue-500 mr-2">📅</span>
                          <span>{meeting}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedDateAttendance.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-sm bg-gray-50 p-2 rounded italic">
                    {selectedDateAttendance.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              <p>No attendance record for this date</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm">📝 No tasks scheduled</p>
                <p className="text-sm">📅 No meetings planned</p>
                <p className="text-sm">💭 No notes available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
