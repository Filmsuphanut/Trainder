  
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    vus: 10,
    iterations: 100,
};

export default function() {
  http.get('https://trainder.evera.cloud/');
  sleep(2);
}