function addRulesOfEngagement(html) {
  const element = `
    <div class="container rules" id="rules">
      <h3>
        <i>local_florist</i>
        How Pink et Tu Works
        <i>local_florist</i>
      </h3>
      <p>Pink et Tu is a platform for hook ups featuring adult content. It enables workers to create profiles and
        interested clients are welcome to request for their services.</p>
      <p>For all enquiries and complaints, contact the admin at <a
          href="mailto:pinkettung@gmail.com"><b>pinkettung@gmail.com</b></a> or send a message in the contact section below.
      </p>

      <p>Report all fraudsters, fraudulent and violent activities to the admin in the contact section below. The admin is able to eject any member of
        the platform that does act in such a manner that is expected and appropriate.
      </p>

      <h4>Rules of Engagement</h4>
      <ul>
        <li>
          Pinkettu uses a common hook up code known only by the worker and the client to set up hook ups. Without this
          <b>code</b>, no hookup is endorsed by Pink et Tu.
        </li>
        <li>
          Clients and workers also have <b>secret codes</b> known only by owner of the code. Clients and workers must share their
          secret codes to verify the hookup.
        </li>
        <li>
          Workers are paid only after verification. Clients will not share their <b>secret codes</b> until they meet with the
          workers.
        </li>
        <li>
          Workers will not render any service to clients until the client shares his secret code.
        </li>
        <li>
          Pinkettu does not share workers contact with clients until after payment.
        </li>
        <li>
          Only workers who have set their rates can be viewed by clients.
        </li>
        <li>
          Workers will pay a fee of <b>₦1, 000</b> to activate their accounts.
        </li>
        <li>
          Clients selects the worker, pays and makes arrangements with workers directly after payment.
        </li>
      </ul>
    </div>
  `;
  const query = document.title === 'Home | Pink et tu' ? 'div.contact' : 'body > footer:last-of-type';
  const footer = html || document.querySelector(query);
  footer.insertAdjacentHTML('beforebegin', element);
}

addRulesOfEngagement();