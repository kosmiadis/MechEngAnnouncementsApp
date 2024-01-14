module.exports = function formatDate(date, month , year) {
    const d = {date, month, year}
    switch(month) {
        case(1):
            d.month = 'Ιανουαρίου'
            break;
        case(2):
            d.month = 'Φεβρουαρίου'
            break;
        case(3):
            d.month = 'Μαρτίου'
            break;
        case(4):
            d.month = 'Απριλίου'
            break;
        case(5):
            d.month = 'Μαΐου'
            break;
        case(6):
            d.month = 'Ιουνίου'
            break;
        case(7):
            d.month = 'Ιουλίου'
            break;
        case(8):
            d.month = 'Αυγούστου'
            break;
        case(9):
            d.month = 'Σεπτεμβρίου'
            break;
        case(10):
            d.month = 'Οκτωβρίου'
            break;
        case(11):
            d.month = 'Νοεμβρίου'
            break;
        case(12):
            d.month = 'Δεκεμβρίου'
            break;
    }
    return `${d.date} ${d.month} ${d.year}`
}
