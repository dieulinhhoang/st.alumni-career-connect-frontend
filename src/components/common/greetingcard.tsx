import '../css/GreetingCard.css';

type TimeSlot = 'morning' | 'noon' | 'afternoon' | 'evening';

interface GreetingConfig {
  main: string;
  sub: string;
  icon: string;
  timeClass: TimeSlot;
}

function getGreeting(hour: number): GreetingConfig {
  if (hour >= 5 && hour < 12)
    return { main: 'Chào buổi sáng!', sub: 'Chúc bạn một ngày tràn đầy năng lượng ✨', icon: '☀️', timeClass: 'morning' };
  if (hour >= 12 && hour < 14)
    return { main: 'Chào buổi trưa!', sub: 'Nhớ nghỉ ngơi một chút nhé 🍜', icon: '☕', timeClass: 'noon' };
  if (hour >= 14 && hour < 18)
    return { main: 'Chào buổi chiều!', sub: 'Cố lên, sắp xong ngày rồi 💪', icon: '🌇', timeClass: 'afternoon' };
  return { main: 'Chào buổi tối!', sub: 'Chúc bạn buổi tối thư giãn 🌟', icon: '🌙', timeClass: 'evening' };
}

function GreetingCard() {
  const { main, sub, icon, timeClass } = getGreeting(new Date().getHours());

  return (
    <div className={`greeting-card ${timeClass}`}>
      <span className="greeting-icon">{icon}</span>
      <div className="greeting-text">
        <span className="greeting-main">{main}</span>
        <span className="greeting-sub">{sub}</span>
      </div>
    </div>
  );
}

export default GreetingCard;