"use client";

import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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
const generateDummyAttendance = () => {
  const data: AttendanceRecord[] = [];

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

      const dateStr = date.toISOString().split("T")[0];
      const isToday = date.toDateString() === new Date().toDateString();

      // Smart probability system
      const random = Math.random();

      let status: AttendanceRecord["status"] = "present";

      if (!isToday) {
        if (random < 0.1) status = "absent"; // 10%
        else if (random < 0.2) status = "half-day"; // 10%
        else if (random < 0.35) status = "late"; // 15%
        else status = "present"; // 65%
      }

      data.push({
        date: dateStr,
        status,
        checkIn:
          status === "absent"
            ? undefined
            : status === "half-day"
            ? "09:30"
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
            ? "Left early for personal work"
            : status === "late"
            ? "Traffic delay"
            : "Regular work day",
        location: status === "absent" ? "Home" : "Office",
      });
    }
  };

  // Current + previous 2 months
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
  const calendarRef = useRef<FullCalendar>(null);

  const getAttendanceForDate = (
    dateStr: string
  ): AttendanceRecord | undefined => {
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

  const events = attendanceData.map((record) => ({
    start: record.date,
    allDay: true,
    display: "background",
    backgroundColor: "transparent", // background events used for custom rendering
    extendedProps: { ...record },
  }));

  const renderEventContent = (eventInfo: any) => {
    const record = eventInfo.event.extendedProps as AttendanceRecord;
    return (
      <div className="flex justify-center items-center h-full pt-1">
        <div
          className={`w-2 h-2 rounded-full ${getStatusColor(record.status)}`}
        ></div>
      </div>
    );
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
  };

  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const selectedDateAttendance = getAttendanceForDate(selectedDateStr);

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
        {[
          { label: "Present", value: stats.present, color: "bg-green-500" },
          { label: "Absent", value: stats.absent, color: "bg-red-500" },
          { label: "Late", value: stats.late, color: "bg-yellow-500" },
          { label: "Half Day", value: stats.halfDay, color: "bg-blue-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${stat.color} rounded-full mr-2`}></div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Calendar
          </h3>
          <div className="attendance-calendar fullcalendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              eventContent={renderEventContent}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              height="auto"
              selectable={true}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {[
              { label: "Present", color: "bg-green-500" },
              { label: "Absent", color: "bg-red-500" },
              { label: "Late", color: "bg-yellow-500" },
              { label: "Half Day", color: "bg-blue-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center">
                <div
                  className={`w-3 h-3 ${item.color} rounded-full mr-2`}
                ></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Details */}
        <div
          className="bg-white p-6 rounded-lg shadow thin-scroll h-full"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {selectedDateAttendance ? (
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-4 h-4 rounded-full mr-3 ${getStatusColor(
                    selectedDateAttendance.status
                  )}`}
                ></div>
                <span className="font-semibold text-lg">
                  {getStatusText(selectedDateAttendance.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedDateAttendance.checkIn && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Check In
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedDateAttendance.checkIn}
                    </p>
                  </div>
                )}
                {selectedDateAttendance.checkOut && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">
                      Check Out
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedDateAttendance.checkOut}
                    </p>
                  </div>
                )}
              </div>

              {selectedDateAttendance.checkIn &&
                selectedDateAttendance.checkOut && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs text-blue-600 uppercase font-bold">
                      Total Hours
                    </p>
                    <p className="text-xl font-bold text-blue-900">
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
                        return `${diff.toFixed(1)} hrs`;
                      })()}
                    </p>
                  </div>
                )}

              {selectedDateAttendance.location && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Location
                  </p>
                  <p className="font-medium flex items-center gap-1">
                    <span className="text-gray-400">📍</span>{" "}
                    {selectedDateAttendance.location}
                  </p>
                </div>
              )}

              {selectedDateAttendance.tasks &&
                selectedDateAttendance.tasks.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">
                      Tasks Completed
                    </p>
                    <ul className="space-y-2">
                      {selectedDateAttendance.tasks.map((task, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start bg-green-50 p-2 rounded border border-green-100"
                        >
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-green-900">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedDateAttendance.meetings &&
                selectedDateAttendance.meetings.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2">
                      Meetings
                    </p>
                    <ul className="space-y-2">
                      {selectedDateAttendance.meetings.map((meeting, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start bg-purple-50 p-2 rounded border border-purple-100"
                        >
                          <span className="text-purple-500 mr-2">📅</span>
                          <span className="text-purple-900">{meeting}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedDateAttendance.notes && (
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-gray-700 italic bg-yellow-50 p-3 rounded-lg border border-yellow-100 shadow-sm">
                    "{selectedDateAttendance.notes}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p className="font-medium text-center">
                No attendance record for this date
              </p>
              <div className="mt-8 w-full space-y-3 opacity-50">
                <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .fullcalendar-container .fc {
          max-width: 100%;
          font-family: inherit;
        }
        .fullcalendar-container .fc-toolbar-title {
          font-size: 1.2rem !important;
          font-weight: 600;
        }
        .fullcalendar-container .fc-button {
          background-color: #3b82f6 !important;
          border: none !important;
          text-transform: capitalize;
        }
        .fullcalendar-container .fc-button:hover {
          background-color: #2563eb !important;
        }
        .fullcalendar-container .fc-day-today {
          background-color: #eff6ff !important;
        }
        .fullcalendar-container .fc-daygrid-day-top {
          flex-direction: column;
        }
        .fullcalendar-container .fc-daygrid-event-harness {
          margin: 0 !important;
        }
        .fullcalendar-container .fc-scroller {
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
}
