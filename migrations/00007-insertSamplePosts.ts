import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
 INSERT INTO posts (title, body, user_id)
  VALUES
  ('Is Vue better than React?', 'I''ve been diving deep into Vue lately and I must say, the learning curve is so much smoother. Any React devs here who''ve made the switch? What''s your take? #webdev #javascript', 1),
  ('Latest Indie Game Hot Takes', 'Just finished "Celestial Challenge" and it''s mind-blowing how indie devs achieve so much with so few resources. What''s an indie game that left you amazed? #gaming #indiedevs', 2),
  ('AI''s ethical dilemma', 'As an AI grows more complex, the line between code and consciousness blurs. How do we define ethical boundaries for something that learns beyond its programming? #AIethics #MachineLearning', 3),
  ('Quantum Computing Breakthroughs', 'Quantum supremacy is a hot topic, but are we truly ready for it? The implications for encryption and data security are vast. #QuantumComputing #CyberSecurity', 4),
  ('Astrophotography Tips', 'Captured the Orion Nebula last night with a long exposure shot. Any fellow astrophotographers here? Share your shots and setups! #astrophotography #space', 4),
  ('Coding Marathon!', '24-hour coding marathon was a success! Developed a full-stack app with some cool peeps. Any other devs love these hackathons? #coding #fullstack', 6),
  ('The Speed of Light', 'Nothing''s faster than the speed of light, they said. But what about the speed of dark? #showerthoughts #physics', 7),
  ('Navigating the Cosmos', 'If you could navigate the cosmos at warp speed, where''s the first place you''d go? #space #travel', 8),
  ('Digital Age Philosophy', 'In the digital age, are we losing our humanity or finding a new version of it? #philosophy #tech', 9),
  ('No Man''s Sky Update', 'The latest No Man''s Sky update is a game-changer. Literally. But is it enough to redeem its rocky start? #gaming #NoMansSky', 10),
  ('The Search for Exoplanets', 'Discovering new exoplanets makes me wonder about the potential for other life forms looking back at us. #exoplanets #astronomy', 11),
  ('Mechanics of the Quantum', 'If you could observe a quantum particle without changing it, would you? Or is the mystery part of the charm? #quantummechanics #science', 12),
  ('Surfing Solar Waves', 'If surfing solar waves becomes a sport in the future, sign me up! #futuresports #solar', 13),
  ('The VR Music Scene', 'Virtual Reality concerts could be the next big thing. Imagine seeing your favorite band in 3D from your living room. #VR #music', 14),
  ('Digital Nomad Life', 'As a digital nomad, I find the concept of home to be more digital than physical. Does anyone else feel the same? #DigitalNomad #remoteWork', 15),
  ('The Epic of Exploration', 'Every explorer has an epic story. What''s the most unforgettable adventure you''ve had? #exploration #adventure', 16),
  ('Retro Gaming Love', 'Nothing beats the charm of retro games. The pixel art, the chiptunes, the simplicity. It''s pure nostalgia. #RetroGaming #nostalgia', 17),
  ('Crypto''s Wild Ride', 'Watching the crypto markets is like riding a rollercoaster with no safety bar. #crypto #blockchain', 18),
  ('Sonic Boom!', 'If you could experience a sonic boom without the ear damage, would you? Asking for a friend. #sonicboom #sound', 19),
  ('Rocket Launch!', 'Just watched a rocket launch and it was spectacular! What''s the one thing you''d send to space if you could? #rocket #space', 20),
  ('Earth''s Hidden Gems', 'Found a hidden gem in my city today. It''s amazing what you discover when you walk rather than drive. #travel #Earth', 21),
  ('Tech Glitches', 'A glitch in the matrix or just a coding error? Had a weird tech glitch today that made me question reality for a second. #glitch #TheMatrix', 22),
  ('Time Travel Wishes', 'If time travel becomes possible, what year would you visit first and why? #TimeTravel #history', 23),
  ('Myth Busting', 'Today I learned that Vikings never actually had horned helmets. Mind = Blown. #mythbusting #history', 24),
  ('Stealth Mode', 'Managed to finish all my tasks today without a single distraction. Felt like a ninja. #productivity #ninja', 25),
  ('Mountain vs. Mars', 'Climbing a mountain is tough. But I bet it''s nothing compared to climbing Olympus Mons on Mars. #mountaineering #Mars', 26),
  ('Plasma Physics', 'Plasma is the most common state of matter in the universe. It''s also the most fun to say. Plasmaaa. #physics #matter', 27),
  ('Solar Power!', 'Just installed solar panels. Feels good to harness the power of the sun! #solarpower #renewables', 28),
  ('Meteor Shower Tonight!', 'Don''t forget to look up tonight for the meteor shower. Wishing on a shooting star is still magical, no matter how old you get. #MeteorShower #space', 29),
  ('Lunar Rover''s Playlist', 'If you could add a song to the lunar rover''s playlist, what would it be? I''d choose "Walking on the Moon" by The Police. #space #music', 30);
`;
}

export async function down(sql: Sql) {
  await sql`
    DELETE FROM posts
    WHERE user_id IN (
      '2','3','4','4','6','7','8','8','10','11','12','13','14','14','16','17','18','18','21','22','23','24','24','26','27','28','28','30','31'
    );
  `;
}
