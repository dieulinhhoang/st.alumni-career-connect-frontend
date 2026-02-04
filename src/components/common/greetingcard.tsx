import '../css/GreetingCard.css';

function greetingcard() {
    const h = new Date().getHours();
    let msg;
    let timeClass = 'evening';
    if (h >= 5 && h < 12) {
        msg = "Chào buổi sáng , Admin . Chúc bạn một ngày tốt lành ! ";
        timeClass = 'morning';
    }
    else if (h >= 12 && h < 14) {
        msg = "Chào buổi trưa ,Admin . Chúc bạn một ngày tốt lành ! ";
        timeClass = 'noon';
    }
    else if (h >= 14 && h < 18) {
        msg = "Chào buổi chiều, Admin . Chúc bạn một ngày tốt lành !  ";
        timeClass = 'afternoon'
    }
    return (
        <div className={`greeting-card ${timeClass}`}>
            {msg}
        </div>
    )
}
export default greetingcard;