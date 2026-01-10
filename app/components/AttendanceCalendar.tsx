"use client";

import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late" | "half-day" | "holiday";
  checkIn?: string;
  checkOut?: string;
  tasks?: string[];
  meetings?: string[];
  notes?: string;
  location?: string;
  holidayName?: string;
  holidayDescription?: string;
}

const getIndianHoliday = (date: Date): { name: string; description: string } | null => {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  // Fixed Holidays
  if (month === 0 && day === 26) return { name: "Republic Day", description: "Honoring the date on which the Constitution of India came into effect in 1950." };
  if (month === 7 && day === 15) return { name: "Independence Day", description: "Commemorating the nation's independence from the United Kingdom in 1947." };
  if (month === 9 && day === 2) return { name: "Gandhi Jayanti", description: "Celebrating the birthday of Mahatma Gandhi, the Father of the Nation." };
  if (month === 11 && day === 25) return { name: "Christmas", description: "Celebrating the birth of Jesus Christ." };
  
  // Approximate Variable Holidays for Demo (2025/2026)
  if (month === 2 && day === 14) return { name: "Holi", description: "The festival of colors, signifying the victory of good over evil." }; 
  if (month === 9 && day === 20) return { name: "Diwali", description: "The festival of lights, symbolizing the spiritual victory of light over darkness." };
  if (month === 3 && day === 14) return { name: "Ambedkar Jayanti", description: "Celebrating the birthday of Dr. B.R. Ambedkar." };

  return null;
};

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
      const holidayInfo = getIndianHoliday(date);

      // Use local date string construction to avoid timezone shifts
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      if (holidayInfo) {
        data.push({
          date: dateStr,
          status: "holiday",
          holidayName: holidayInfo.name,
          holidayDescription: holidayInfo.description,
          notes: `Public Holiday: ${holidayInfo.name}`,
        });
        continue;
      }

      // Skip future dates for regular attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) continue;

      // Skip only Sunday
      if (date.getDay() === 0) continue;

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
      case "holiday":
        return "bg-purple-100";
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
      case "holiday":
        return "Holiday";
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

    if (record.status === "holiday") {
      return (
        <div className="flex justify-center items-end h-full pb-1">
          <div className="text-xs" title={record.holidayName}>
            🎉
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-end h-full pb-2">
        <div
          className={`w-2 h-2 rounded-full ${getStatusColor(record.status)}`}
        ></div>
      </div>
    );
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
  };

  // Construct local date string to match the data format (YYYY-MM-DD)
  // toISOString() converts to UTC, which shifts dates in many timezones
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const selectedDateStr = `${year}-${month}-${day}`;
  
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
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Present", value: stats.present, color: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
          { label: "Absent", value: stats.absent, color: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
          { label: "Late", value: stats.late, color: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50" },
          { label: "Half Day", value: stats.halfDay, color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm ${stat.bg} transition-transform hover:-translate-y-1`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${stat.text} opacity-80`}>{stat.label}</p>
                <p className={`text-2xl font-black ${stat.text}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* Calendar */}
        <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
              Attendance Calendar
            </h3>
            <div className="flex gap-4 text-sm">
                {[
                { label: "Present", color: "bg-green-500" },
                { label: "Absent", color: "bg-red-500" },
                { label: "Late", color: "bg-yellow-500" },
                { label: "Half Day", color: "bg-blue-500" },
                { label: "Holiday", color: "bg-purple-100" },
                ].map((item) => (
                <div key={item.label} className="flex items-center">
                    <div className={`w-3 h-3 ${item.color} rounded-full mr-2`}></div>
                    <span className="text-[var(--color-text-secondary)] font-medium">{item.label}</span>
                </div>
                ))}
            </div>
          </div>
          
          <div className="attendance-calendar fullcalendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              eventContent={renderEventContent}
              headerToolbar={{
                left: "prev next",
                center: "title",
                right: "today",
              }}
              firstDay={1}
              showNonCurrentDates={false}
              fixedWeekCount={false}
              height="auto"
              selectable={true}
            />
          </div>
        </div>

        {/* Selected Date Details - Full Width Below */}
        <div className="bg-[var(--color-bg-card)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-4">
            Details for {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {selectedDateAttendance ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center p-4 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                    {selectedDateAttendance.status === 'holiday' ? (
                         <span className="text-2xl mr-3">🎉</span>
                    ) : (
                        <div className={`w-4 h-4 rounded-full mr-3 ${getStatusColor(selectedDateAttendance.status)}`}></div>
                    )}
                    <span className="font-bold text-lg text-[var(--color-text-primary)]">
                    {selectedDateAttendance.holidayName || getStatusText(selectedDateAttendance.status)}
                    </span>
                </div>
                {selectedDateAttendance.location && (
                    <div className="p-4 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-1">
                        Location
                    </p>
                    <p className="font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
                        <span>📍</span> {selectedDateAttendance.location}
                    </p>
                    </div>
                )}
                
                {selectedDateAttendance.holidayDescription && (
                  <div className="p-4 bg-purple-50 rounded-[var(--radius-md)] border border-purple-100">
                    <p className="text-xs text-purple-600 uppercase font-black mb-1">
                      About this Holiday
                    </p>
                    <p className="text-sm text-purple-900 leading-relaxed">
                      {selectedDateAttendance.holidayDescription}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {selectedDateAttendance.status !== 'holiday' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                            <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-1">Check In</p>
                            <p className="font-mono font-bold text-[var(--color-text-primary)]">{selectedDateAttendance.checkIn || "--:--"}</p>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-main)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                            <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-1">Check Out</p>
                            <p className="font-mono font-bold text-[var(--color-text-primary)]">{selectedDateAttendance.checkOut || "--:--"}</p>
                        </div>
                    </div>
                    {selectedDateAttendance.checkIn && selectedDateAttendance.checkOut && (
                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-[var(--radius-md)]">
                            <p className="text-xs text-indigo-600 uppercase font-black">Total Hours</p>
                            <p className="text-xl font-black text-indigo-900">
                            {(() => {
                                const checkIn = new Date(`2024-01-01 ${selectedDateAttendance.checkIn}`);
                                const checkOut = new Date(`2024-01-01 ${selectedDateAttendance.checkOut}`);
                                const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
                                return `${diff.toFixed(1)} hrs`;
                            })()}
                            </p>
                        </div>
                    )}
                  </>
                )}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedDateAttendance.tasks && selectedDateAttendance.tasks.length > 0 && (
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-3">
                      Tasks Completed
                    </p>
                    <ul className="space-y-2">
                      {selectedDateAttendance.tasks.map((task, index) => (
                        <li key={index} className="text-sm flex items-start bg-emerald-50 p-2 rounded-[var(--radius-sm)] border border-emerald-100">
                          <span className="text-emerald-600 mr-2 font-bold">✓</span>
                          <span className="text-emerald-900 font-medium">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(selectedDateAttendance.meetings?.length ?? 0) > 0 || selectedDateAttendance.notes ? (
                    <div className="space-y-4">
                        {selectedDateAttendance.meetings && selectedDateAttendance.meetings.length > 0 && (
                        <div>
                            <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-3">
                            Meetings
                            </p>
                            <ul className="space-y-2">
                            {selectedDateAttendance.meetings.map((meeting, index) => (
                                <li key={index} className="text-sm flex items-start bg-purple-50 p-2 rounded-[var(--radius-sm)] border border-purple-100">
                                <span className="text-purple-600 mr-2">📅</span>
                                <span className="text-purple-900 font-medium">{meeting}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                        )}
                         {selectedDateAttendance.notes && (
                            <div>
                            <p className="text-xs text-[var(--color-text-muted)] uppercase font-black mb-2">
                                Notes
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)] italic bg-amber-50 p-3 rounded-[var(--radius-md)] border border-amber-100">
                                "{selectedDateAttendance.notes}"
                            </p>
                            </div>
                        )}
                    </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-bg-main)]">
              <div className="w-16 h-16 bg-[var(--color-bg-card)] rounded-full flex items-center justify-center shadow-sm mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h4 className="text-[var(--color-text-primary)] font-bold mb-2">No Record Found</h4>
              <p className="text-[var(--color-text-secondary)] text-sm max-w-xs mx-auto">
                This day has no attendance data recorded. It might be a weekend or a holiday.
              </p>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .fullcalendar-container .fc {
          max-width: 100%;
          font-family: inherit;
          --fc-border-color: var(--color-border);
          --fc-button-text-color: #fff;
          --fc-button-bg-color: var(--color-primary);
          --fc-button-border-color: var(--color-primary);
          --fc-button-hover-bg-color: var(--color-primary-hover);
          --fc-button-hover-border-color: var(--color-primary-hover);
          --fc-button-active-bg-color: var(--color-primary-hover);
          --fc-button-active-border-color: var(--color-primary-hover);
          --fc-today-bg-color: var(--color-primary-light);
        }
        .fullcalendar-container .fc-toolbar-title {
          font-size: 1.2rem !important;
          font-weight: 700;
          color: var(--color-text-primary);
        }
        .fullcalendar-container .fc-button {
          border-radius: var(--radius-md) !important;
          text-transform: capitalize;
          font-weight: 600;
          padding: 8px 16px !important;
          box-shadow: var(--shadow-sm);
          margin-right: 8px !important;
        }
        .fullcalendar-container .fc-button:last-child {
          margin-right: 0 !important;
        }
        .fullcalendar-container .fc-col-header-cell-cushion {
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 12px 0 !important;
        }
        .fullcalendar-container .fc-daygrid-day-number {
          color: var(--color-text-primary);
          font-weight: 500;
          margin: 4px !important;
        }
        .fullcalendar-container .fc-daygrid-day:hover {
            background-color: var(--color-bg-main);
        }
        .fullcalendar-container .fc-daygrid-event-harness {
          margin: 0 !important;
        }
        /* Style for empty/non-current dates */
        .fullcalendar-container .fc-day-other {
          background-color: var(--color-bg-main) !important;
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.03) 10px,
            rgba(0, 0, 0, 0.03) 20px
          ) !important;
        }
        /* Style Sunday as off-day (Red) */
        .fullcalendar-container .fc-daygrid-day.fc-day-sun {
          background-color: rgba(239, 68, 68, 1) !important;

        }
        .fullcalendar-container .fc-col-header-cell.fc-day-sun {
          color: var(--color-error) !important;
        }
      `}</style>
    </div>
  );
}
