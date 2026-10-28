import http.server
import socketserver
import json
import csv
import os
import sys
from datetime import datetime

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)
CSV_FILE = os.path.join(BASE_DIR, 'conferme_invitati.csv')

# Inizializza il file CSV con intestazione per Excel se non esiste ancora
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(['Data Registrazione', 'Nome', 'Cognome', 'Partecipazione', 'Intolleranze / Allergie'])

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/rsvp':
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)
            try:
                data = json.loads(post_body.decode('utf-8'))
                nome = data.get('nome', '').strip()
                cognome = data.get('cognome', '').strip()
                attendance = data.get('attendance', 'yes').strip()
                intolleranze = data.get('intolleranze', '').strip()
                now = datetime.now().strftime('%d/%m/%Y %H:%M:%S')

                presenza = 'Sì' if (attendance == 'yes' or data.get('presenza') == 'Sì') else 'No'
                has_intol = data.get('hasIntolerance') or data.get('intolleranze') == 'Sì' or (intolleranze and intolleranze != 'No' and intolleranze != 'Nessuna')
                dettagli = data.get('tipoIntolleranza') or data.get('dettaglioIntolleranze', '')
                if has_intol:
                    tipo_intol_val = dettagli if (dettagli and dettagli != 'Sì') else 'Sì'
                else:
                    tipo_intol_val = 'No'

                with open(CSV_FILE, mode='a', newline='', encoding='utf-8-sig') as f:
                    writer = csv.writer(f, delimiter=';')
                    writer.writerow([now, nome, cognome, presenza, tipo_intol_val])

                print(f"[EXCEL OK] Registrato: {nome} {cognome} - {presenza} - Tipo Intolleranza: {tipo_intol_val}")
                sys.stdout.flush()

                response_data = json.dumps({'status': 'success', 'message': 'Registrato in Excel'}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(response_data)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response_data)
                return
            except Exception as e:
                err_data = json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err_data)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(err_data)
                return
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Server attivo su http://localhost:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()
