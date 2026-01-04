import { Calendar } from 'lucide-react'
import { calendarEvents } from '../../data/mockData'
import './CalendarPage.css'

function CalendarPage() {
    return (
        <div className="calendar-page">
            <div className="page-header">
                <h1><Calendar size={28} /> Kalender Akademik</h1>
                <p>Jadwal kegiatan dan agenda sekolah</p>
            </div>

            <div className="calendar-content">
                <div className="calendar-placeholder card">
                    <Calendar size={48} />
                    <span>Kalender Interaktif</span>
                    <p>Visualisasi kalender akan ditampilkan di sini</p>
                </div>

                <div className="events-section">
                    <h3>Agenda Mendatang</h3>
                    <div className="event-cards">
                        {calendarEvents.map((event) => (
                            <div key={event.id} className={`card event-card ${event.type}`}>
                                <div className="event-date-box">
                                    <span className="day">{event.startDate.split('-')[2]}</span>
                                    <span className="month">{new Date(event.startDate).toLocaleString('id-ID', { month: 'short' })}</span>
                                </div>
                                <div className="event-details">
                                    <span className={`event-type-badge ${event.type}`}>{event.type}</span>
                                    <h4>{event.title}</h4>
                                    <p>{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarPage
