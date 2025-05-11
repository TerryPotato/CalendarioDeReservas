
    let texto = document.getElementById('visualize-id').innerHTML;
    const copiarContenido = async () => {
        try {
        await navigator.clipboard.writeText(texto);
        console.log('Contenido copiado al portapapeles');
        } catch (err) {
        console.error('Error al copiar: ', err);
        }
    }

        document.addEventListener('DOMContentLoaded', function() {
            const calendarEl = document.getElementById('calendar');
            const calendar = new FullCalendar.Calendar(calendarEl, {
                locale: 'es',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                },
                initialView: 'dayGridMonth',
                navLinks: true,
                editable: true,
                timeZone: 'local', // zona horaria local
                nowIndicator: true,
                events: async function(fetchInfo, successCallback, failureCallback) {
                    try {
                        const response = await fetch('http://localhost:8000/api/eventos');
                        if (!response.ok) {
                            throw new Error('Error al obtener los eventos');
                        }

                        const data = await response.json();
                        const events = data.eventos;

                        const formattedEvents = events.map(event => ({
                            id: event._id,
                            title: event.title,
                            start: event.start,
                            end: event.end
                        }));

                        successCallback(formattedEvents);
                    } catch (error) {
                        console.error('Error al cargar los eventos:', error);
                        failureCallback(error);
                    }
                },
                dayMaxEvents: true,
                nowIndicator: true,
                firstDay: 1,
                businessHours: {
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '09:00',
                    endTime: '18:00'
                },
                // Manejar clic en un evento
                eventClick: function(info) {
                    openModal({
                        id: info.event.id,
                        title: info.event.title,
                        start: info.event.start,
                        end: info.event.end,
                        color: info.event.backgroundColor,
                        description: info.event.extendedProps.description
                    });
                },
                // Manejar clic en una fecha
                dateClick: function(info) {
                    openModal({
                        start: info.dateStr,
                        allDay: info.allDay
                    });
                },
            });
            

            calendar.render();
        });

        function openModal(eventData = {}) {
            if (eventData.id) {
                // Si hay un ID, se trata de visualizar un evento
                const visualizeModal = new bootstrap.Modal(document.getElementById('visualizeEventModal'));
                document.getElementById('visualize-id').value = eventData.id;
                document.getElementById('visualize-title').value = eventData.title || '';
                document.getElementById('visualize-start').value = eventData.start ? eventData.start.toISOString().slice(0, 10) : '';
                document.getElementById('visualize-end').value = eventData.end ? eventData.end.toISOString().slice(0, 10) : '';

                visualizeModal.show();
            } else {
                // Si no hay ID, se trata de agregar un nuevo evento
                const addModal = new bootstrap.Modal(document.getElementById('addEventModal'));
                document.getElementById('add-start').value = eventData.start || '';
                document.getElementById('add-end').value = eventData.end || '';
                addModal.show();
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            // Botón para guardar un nuevo evento
            document.getElementById('saveAddEvent').addEventListener('click', async () => {
                const title = document.getElementById('add-title').value;
                const start = document.getElementById('add-start').value; // Enviar como YYYY-MM-DD
                let end = document.getElementById('add-end').value; // Enviar como YYYY-MM-DD

                if (!title || !start || !end) {
                    alert('Por favor, completa todos los campos.');
                    return;
                }

                // Suma un día a la fecha de fin
                const endDate = new Date(end);
                endDate.setDate(endDate.getDate() + 1);
                end = endDate.toISOString().split('T')[0]; // Convierte de nuevo a YYYY-MM-DD

                try {
                    const response = await fetch('http://localhost:8000/api/eventos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ title, start, end }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        alert('Evento agregado exitosamente');
                        console.log(data);
                        location.reload(); // Recarga el calendario
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (err) {
                    console.error('Error al agregar el evento:', err);
                    alert('Hubo un error al conectar con el servidor.');
                }
            });

            // Botón para eliminar un evento
            document.getElementById('confirmDeleteEvent').addEventListener('click', function () {
                const id = document.getElementById('delete-id').value;

                console.log('Eliminar Evento con ID:', id);
                // Aquí realizar solicitud DELETE al backend para eliminar el evento
            });

            // Botón para guardar cambios en un evento
            document.getElementById('saveEditEvent').addEventListener('click', function () {
                const id = document.getElementById('edit-id').value;
                const title = document.getElementById('edit-title').value;
                const start = document.getElementById('edit-start').value;
                const end = document.getElementById('edit-end').value;

                console.log('Modificar Evento:', { id, title, start, end });
                // Aquí realizar solicitud PUT al backend para modificar el evento
            });

            // Botón para copiar el ID del evento
            document.getElementById('copyIdButton').addEventListener('click', async () => {
                const idField = document.getElementById('visualize-id');
                try {
                    await navigator.clipboard.writeText(idField.value);
                    alert('ID copiado al portapapeles');
                } catch (err) {
                    console.error('Error al copiar el ID:', err);
                    alert('No se pudo copiar el ID');
                }
            });
        });
