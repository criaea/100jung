import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

// --- DATA CONSTANTS ---

const letterDescriptions: Record<string, string> = {
    'I': "For Jung, Introversion is a movement of negative relation to the object. The subject (the self) is the prime motivating factor, while the object (the external world) is secondary or even draining. The introvert interposes a subjective view between themselves and the world. Their energy defends against external claims. They are not necessarily shy, but their reality is derived from their internal reaction to impressions rather than the impressions themselves. They tend to be reflective, seeking depth over breadth, and often feel that the outer world is 'too much,' requiring a retreat to the inner citadel to recharge.",
    'E': "Extroversion is a positive relation to the object. The subject yields to the fascinating influence of the external world. Their psychic life is played out outside themselves, among people and things. They are oriented by objective data and established moral/social laws. Their inner life is often subordinate to external necessities. They risk losing themselves in the object, becoming identical with their role or environment. However, they possess a vital capacity to adapt to life's circumstances and to maintain a healthy, active connection with the collective reality. They find solitude draining and life-giving energy in interaction.",
    'S': "Sensation is the function that bridges the gap between the physical world and the psyche. It is the perception of reality through the five senses. In the Extroverted attitude, it perceives the object exactly as it is—the redness of the rose, the hardness of the stone. It is the supreme realism. In the Introverted attitude, it perceives the subjective impression the object makes. Sensation anchors the psyche in the here and now, preventing it from floating away into fantasy or abstract theory. It is the function of the 'Real.'",
    'N': "Intuition is perception via the unconscious. It is a kind of instinctive comprehension that arrives at the total picture without knowing how it got there. It peers around corners. While Sensation sees the tree, Intuition sees the forest and the ecosystem's future. It is the mother of creativity and prophecy. In the Extroverted attitude, it seeks possibilities in the objective world. In the Introverted attitude, it seeks possibilities in the subjective world. It often conflicts with Sensation, as one cannot focus on 'what is' and 'what could be' simultaneously.",
    'T': "Thinking is the function of intellectual judgment. It brings the contents of ideation into conceptual connection with one another. It seeks to satisfy the laws of logic. Extroverted Thinking builds its structure on objective facts and generally accepted ideas. Introverted Thinking builds its structure on subjective, internal premises. It cares less about facts and more about the clarity and depth of the idea itself. Both forms seek to establish an order of 'truth,' stripping away the personal and the emotional to arrive at a valid, consistent conclusion.",
    'F': "Feeling is the function of value judgment. It is completely rational, just as Thinking is, but its logic is the logic of the heart. It assesses the worth of things. Extroverted Feeling aligns its values with objective, collective standards (manners, social harmony). Introverted Feeling aligns its values with deep, subjective, primordial images (individual conscience). Feeling gives life its flavor and direction; without it, we would know what everything is, but not what anything matters.",
    'J': "The Judging attitude utilizes the Rational functions (Thinking and Feeling) to manage life. It is characterized by a desire for closure. The Judging mind wants to categorize, decide, and move on. It prefers a planned, orderly existence where ambiguity is minimized. In the outer world, this manifests as punctuality, decisiveness, and a respect for rules or schedules. However, if over-relied upon, it can lead to rigidity—a refusal to adapt to new information because the mind has already 'decided.'",
    'P': "The Perceiving attitude utilizes the Irrational functions (Sensation and Intuition) to navigate life. It is characterized by a desire for openness. The Perceiving mind wants to gather more data, see more possibilities, and experience the moment fully before—or instead of—coming to a conclusion. It prefers a flexible, spontaneous existence where the unexpected is welcomed. In the outer world, this manifests as adaptability, curiosity, and a 'wait and see' approach. If over-relied upon, it can lead to aimlessness."
};

const personalityDescriptions: Record<string, string> = {
    'ISTC(J)': "The Introverted Sensation type is the archetype of the reliable guardian. Their consciousness is focused on the subjective intensity of sensory impressions, which they store and organize meticulously. Every new event is instantly compared against this vast internal library of past experiences, making them excellent at spotting discrepancies and maintaining continuity. They are not swayed by passing fads; they trust what has been proven to work. Their logic is applied to defend this inner reality, resulting in a character that is systematic, dutiful, and deeply grounded. They bring order to the world by upholding traditions and honoring their commitments.",
    'ISFC(J)': "The Introverted Sensation type with Feeling combines the subjective sensory grounding of the ISTJ with a profound focus on human values. They perceive the world through detailed internal impressions, but their judgment is driven by a need for harmony and care. They are the quiet protectors, often working behind the scenes to ensure the practical needs of others are met. Their loyalty is immense, often identifying closely with a group or family. While they may appear reserved, their inner world is warm and sympathetic. They maintain the social fabric by remembering the details that make people feel valued and safe.",
    'INFC(J)': "The Introverted Intuition type lives in a world of inner images and archetypes. They are less concerned with the surface reality of things and more with the hidden processes and meanings behind them. Their intuition functions like an inner eye, perceiving the 'seeds' of the future before they sprout. This gives them a prophetic or mystical quality. They are often driven by a deep conviction or vision that they feel compelled to express or fulfill. Their challenge is to translate these complex, often wordless insights into a form that the outer world can understand and accept.",
    'INTC(J)': "The Introverted Intuition type with Thinking is the strategic mastermind. Like the INFJ, they are driven by an inner vision of possibility, but they process this vision through a rigorous, objective logic. They are not content to simply 'see' the future; they must build it. They view the world as a chessboard of systems to be optimized and reorganized. Independent and often skeptical of authority, they trust their own insight above all else. They are ruthless in their pursuit of efficiency and truth, willing to tear down established structures if they impede the realization of their long-range plans.",
    'ISTM(P)': "The Introverted Thinking type is the detached analyst of the concrete world. They use their thinking function to construct a complex, internal model of how things work. They are typically quiet observers, gathering factual data until they understand the underlying logic of a system. Unlike the abstract scientist, the ISTP applies this logic to immediate, tangible reality—tools, machines, or crises. They are adaptable and economical in their actions, moving with a cool, rational precision. They value autonomy above all, resisting external rules that clash with their own internal logical principles. They are the masters of the 'art of the possible.'",
    'ISFM(P)': "The Introverted Feeling type is the archetype of the silent artist. Their life is guided by a differentiated and intensive inner feeling process. These values are rarely articulated in words, which can seem inadequate, but are expressed through their actions, demeanor, and aesthetic choices. They seek a profound harmony between their inner truth and their outer life. They can appear cool or aloof on the surface, but inside burns a passionate intensity. They perceive the world with a heightened sensory awareness, seeking to capture the beauty and tragedy of the moment without imposing a judgment upon it.",
    'INFM(P)': "The Introverted Feeling type with Intuition is the idealistic dreamer and healer. Their primary orientation is toward a deep, idiosyncratic system of inner values. Unlike the ISFP, who expresses this through sensory action, the INFP explores it through possibilities and language. They are searching for a reflection of their inner ideal in the outer world. They are sensitive to inauthenticity and are driven by a desire to heal the split between 'what is' and 'what ought to be.' They are the writers and prophets of the heart, often sacrificing their own comfort for a cause that aligns with their moral vision.",
    'INTM(P)': "The Introverted Thinking type with Intuition is the architect of pure reason. They are driven to build accurate internal models of the universe. Their mind is a laboratory where ideas are tested for logical consistency. They are less interested in the practical value of an idea than in its theoretical correctness. They are skeptical, precise, and deeply intellectual. Their intuition provides them with flashes of possibility, which their thinking then dissects and systematizes. They can be oblivious to social niceties or physical surroundings, living almost entirely in a world of abstract concepts and intellectual exploration.",
    'ESTM(P)': "The Extroverted Sensation type is the ultimate realist. They are fully immersed in the stream of objective events. To them, the only thing that matters is the 'here and now.' They are vital, energetic, and driven by a hunger for sensory experience. They do not analyze motives or ponder the future; they act. They are often found in high-stakes environments where quick reflexes and adaptability are key. They have an uncanny ability to see things exactly as they are, without the filter of sentiment or theory, making them excellent problem-solvers in concrete, chaotic situations.",
    'ESFM(P)': "The Extroverted Sensation type with Feeling is the lover of life. Like the ESTP, they are grounded in the present reality, but their orientation is towards people and shared experiences. They approach the world with a warm, realistic optimism. They love material comforts, good food, and social gatherings. They are the most generous and hospitable of types, seeking to make every moment enjoyable. They rely on their senses to navigate relationships, noticing the physical needs and moods of others instantly. They avoid complex analysis, preferring to live fully and harmoniously in the moment.",
    'ENFM(P)': "The Extroverted Intuition type is the inspirer and the change-agent. They perceive the world not as a collection of objects, but as a web of fascinating possibilities. They are constantly scanning the environment for potential—in people, in projects, in ideas. They are magnetic and enthusiastic, able to rally others to their cause. However, they often loathe routine and detail. Once a possibility has been explored and the mystery is gone, they are ready to move on to the next adventure. They live for the 'spark' of creation and the discovery of new connections.",
    'ENTM(P)': "The Extroverted Intuition type with Thinking is the innovator and the debater. They use their intuition to see how systems can be changed or exploited, and their thinking to explain why. They are alert, outspoken, and enjoy the mental gymnastics of argument. They are not bound by tradition; in fact, they enjoy dismantling it to see if a better way exists. They are entrepreneurial in spirit, always looking for the next big idea or the leverage point in a situation. They can be inconsistent, as their loyalty is to the flow of ideas rather than to people or established procedures.",
    'ESTC(J)': "The Extroverted Thinking type is the natural organizer of society. They trust objective facts and universal rules. They feel a strong responsibility to ensure that the environment is structured, logical, and efficient. They are the administrators who enforce the law and the managers who ensure the job gets done. They value competence, clarity, and closure. They may seem rigid to more spontaneous types, but their rigidity comes from a deep commitment to justice and order. They express their values by doing their duty and ensuring that everyone else does theirs.",
    'ESFC(J)': "The Extroverted Feeling type is the harmonizer of the community. They orient themselves by the objective values of their culture—what is considered 'good,' 'polite,' and 'appropriate.' They are deeply attuned to the emotional atmosphere of their environment and work tirelessly to keep it positive. They are the hosts, the caregivers, and the upholders of social tradition. They do not seek to change the world, but to care for the people in it. They need to feel appreciated and connected, and they thrive in environments where cooperation and shared values are the norm.",
    'ENFC(J)': "The Extroverted Feeling type with Intuition is the charismatic pedagogue or leader. They are driven to build help others realize their potential. They possess a unique ability to 'empathize' with a crowd, instinctively knowing what to say to inspire and motivate. They are often found in roles where they can guide, teach, or counsel. They are idealists who organize people not just for efficiency, but for growth. They can sometimes be over-involved in the lives of others, but their intent is almost always to foster harmony and development on a large scale.",
    'ENTC(J)': "The Extroverted Thinking type with Intuition is the natural born leader and executive. They have a drive to organize and lead, but unlike the ESTJ who maintains order, the ENTJ seeks to create new order. They are strategic and focus on the long-term validity of their plans. They are objective, decisive, and often intellectually intimidating. They see inefficiency as a personal failing and are relentless in eliminating it. They are happy to take charge and have little patience for confusion or half-measures. They build systems that are designed to last and to conquer."
};

const questions = [
    { type: "S/N", text: "Are you:", options: ["Observant of your surroundings", "Introspective and thinking"] },
    { type: "E/I", text: "While waiting for the train, do you:", options: ["Chat with others", "Stay silent"] },
    { type: "T/F", text: "When dealing with people, are you:", options: ["Direct", "Gentle"] },
    { type: "J/P", text: "Does workplace clutter:", options: ["Stress you", "Leave you indifferent"] },
    { type: "T/F", text: "Which is easier for you to give?", options: ["Critical/Direct feedback", "Vague feedback (avoiding details)"] },
    { type: "S/N", text: "Do you:", options: ["Stick to the tried and trusted", "Speculate about possibilities"] },
    { type: "J/P", text: "Do you:", options: ["Decide instantaneously", "Linger over decision making"] },
    { type: "S/N", text: "Are you:", options: ["Factual", "Imaginative"] },
    { type: "E/I", text: "When the phone rings, do you:", options: ["Rush to answer it", "Let others answer"] },
    { type: "T/F", text: "Do you place importance on:", options: ["Hard data", "Opinion"] },
    { type: "J/P", text: "Do you prefer agreements to be:", options: ["Written up and signed", "Agreed on word and a handshake"] },
    { type: "T/F", text: "When evaluating others, are you:", options: ["Impersonal and objective", "Subjective and personal"] },
    { type: "S/N", text: "Are you more interested in:", options: ["What is real", "What is possible"] },
    { type: "J/P", text: "Are you more at ease:", options: ["When matters are complete", "With work in progress"] },
    { type: "S/N", text: "Are you always:", options: ["Up to date with the news", "Somewhat out of touch"] },
    { type: "E/I", text: "When socialising, do you:", options: ["Speak with many people", "Speak with a few friends"] },
    { type: "T/F", text: "When you are communicating with others, do you:", options: ["Talk directly", "Talk diplomatically"] },
    { type: "J/P", text: "Do you prefer:", options: ["A detailed outline of work done", "A list of completed tasks"] },
    { type: "T/F", text: "Do you prefer:", options: ["A rational, consistent approach", "A harmonious, personal approach"] },
    { type: "S/N", text: "Do you like authors who:", options: ["Write hard facts", "Use metaphors"] },
    { type: "J/P", text: "Are you more comfortable:", options: ["After a decision is made", "Before a decision is made"] },
    { type: "S/N", text: "Do you find visionaries:", options: ["Annoying", "Fascinating"] },
    { type: "E/I", text: "Does being at a party:", options: ["Energise you", "Drain you"] },
    { type: "T/F", text: "In an argument or discussion, do you:", options: ["Act confrontationally", "Seek collaborative solutions"] },
    { type: "J/P", text: "For you, is giving feedback:", options: ["Easy", "Difficult"] },
    { type: "T/F", text: "Which is preferable for you?", options: ["To be just", "To be understanding"] },
    { type: "S/N", text: "Is 'Common sense':", options: ["Usually reliable", "Occasionally questionable"] },
    { type: "J/P", text: "Do you:", options: ["Do one job at a time", "Work at many jobs simultaneously"] },
    { type: "S/N", text: "Do you:", options: ["Say what is on your mind", "Express many opinions"] },
    { type: "E/I", text: "In a group of people, do you:", options: ["Talk a lot", "Mostly listen"] },
    { type: "T/F", text: "Which sums you up best?", options: ["Cool-headed", "Warm-hearted"] },
    { type: "J/P", text: "Are you:", options: ["Organised", "Spontaneous"] },
    { type: "T/F", text: "In work situations, do you:", options: ["Give orders", "Get everyone to find solutions"] },
    { type: "S/N", text: "Do you prefer:", options: ["Sensible/Factual people", "People who explore options"] },
    { type: "J/P", text: "Do you prefer to:", options: ["Work to deadlines", "Work whenever"] },
    { type: "S/N", text: "Which ability do you consider best?", options: ["Ability to follow a plan", "Ability to adapt and adjust plans"] },
    { type: "E/I", text: "Are you:", options: ["A social person", "A private person"] },
    { type: "T/F", text: "Which are you?", options: ["A logical person", "A feeling person"] },
    { type: "J/P", text: "Do you decide:", options: ["Based on analysis", "On a considered hunch"] },
    { type: "T/F", text: "Which is most satisfying for you?", options: ["Thorough discussion", "Reaching agreement"] },
    { type: "S/N", text: "After a meal, do you:", options: ["Tidy up immediately", "Leave it until later"] },
    { type: "J/P", text: "Is your behaviour:", options: ["Hurried", "Laid back"] },
    { type: "S/N", text: "Do you hear what is said as:", options: ["The whole story", "Most of the story"] },
    { type: "E/I", text: "Do you:", options: ["Share your feelings easily", "Act reserved"] },
    { type: "T/F", text: "Are you:", options: ["An uncompromising person", "A collaborative person"] },
    { type: "J/P", text: "Do you find it:", options: ["Stressful to change plans", "Easy to reschedule meetings"] },
    { type: "T/F", text: "Are you:", options: ["Tough-minded", "Fair-minded"] },
    { type: "S/N", text: "When evaluating a situation, do you:", options: ["See only what is in front of you", "Imagine more possibilities"] },
    { type: "J/P", text: "Is your approach to:", options: ["Ensure everything is arranged", "Just let things happen"] },
    { type: "S/N", text: "Do you only trust:", options: ["Past experiences", "That all possibilities are worth checking"] },
    { type: "E/I", text: "Do you:", options: ["Know a little about everything", "Know much about a few things"] },
    { type: "T/F", text: "Are you convinced more often by:", options: ["Hard evidence", "Possible outside-the-box solutions"] },
    { type: "J/P", text: "Is your approach to life:", options: ["Structured", "Flexible"] },
    { type: "T/F", text: "Which is the greatest asset?", options: ["Strength of will", "Strength of fair compassion"] },
    { type: "S/N", text: "Do you always feel:", options: ["Down to earth", "Like you daydream a little"] },
    { type: "J/P", text: "How do you cope with unexpected events?", options: ["Get a good handle on things", "Get very stressed"] },
    { type: "S/N", text: "Do you act in a:", options: ["Routine way", "Whimsical way"] },
    { type: "E/I", text: "Are you:", options: ["A good conversationalist", "A good listener"] },
    { type: "T/F", text: "Are you:", options: ["Thick-skinned", "Sensitive"] },
    { type: "J/P", text: "Do you tend to:", options: ["Rely on old ways of doing", "Be on the lookout for new ways"] },
    { type: "T/F", text: "Do you prefer to:", options: ["Operate the production machine", "Manage the team of people"] },
    { type: "S/N", text: "Are you more:", options: ["Practical", "Ingenious"] },
    { type: "J/P", text: "Are you:", options: ["More punctual", "Leisurely/Nonchalant"] },
    { type: "S/N", text: "Do you approach work in:", options: ["An organised and principled way", "An innovative and flexible way"] },
    { type: "E/I", text: "Are you:", options: ["Social and outgoing", "Reserved and quiet"] },
    { type: "T/F", text: "Do you most trust:", options: ["Your experience", "Your hunches"] },
    { type: "J/P", text: "Are you:", options: ["Always on the go", "Relaxed, easy going"] },
    { type: "T/F", text: "Which is the greater error?", options: ["Being too passionate", "Being too objective"] },
    { type: "S/N", text: "Do you tend to be more:", options: ["Deliberate", "Spontaneous"] },
    { type: "J/P", text: "In evaluating others, what influences you most?", options: ["Laws", "Circumstances"] },
    { type: "S/N", text: "Which do you prefer in stories/film?", options: ["Action", "Fantasy"] },
    { type: "E/I", text: "In your sports club, do you:", options: ["Promote activities", "Do the administration"] },
    { type: "T/F", text: "Which is more difficult for you?", options: ["To identify with others", "To utilise others"] },
    { type: "J/P", text: "Are you:", options: ["A deadlines person", "A 'just whenever' person"] },
    { type: "T/F", text: "Which is most vital?", options: ["Following the to-do list", "Teamwork"] },
    { type: "S/N", text: "Are you:", options: ["Easy to talk to/approach", "Shy and reserved"] },
    { type: "J/P", text: "When do you plan your annual holidays?", options: ["Months before", "Weeks before"] },
    { type: "S/N", text: "Are you attracted to:", options: ["The fundamentals", "The promise"] },
    { type: "T/F", text: "For you, which is more important?", options: ["Following the rules", "Everyone taking full responsibility"] },
    { type: "J/P", text: "Do you use:", options: ["Written work schedules", "Your memory"] }
];

const profileGridData = [
    { type: 'ISTC(J)', title: "Life's Natural Organizers", color: 'a' },
    { type: 'ISFC(J)', title: "Committed to Getting the Job Done", color: 'b' },
    { type: 'INFC(J)', title: "An Inspiring Leader and Follower", color: 'a' },
    { type: 'INTC(J)', title: "Life's Independent Thinkers", color: 'b' },
    { type: 'ESTM(P)', title: "Making the Most of the Moment", color: 'b' },
    { type: 'ESFM(P)', title: "Let's Make Work Fun", color: 'a' },
    { type: 'ENFM(P)', title: "People Are the Product", color: 'b' },
    { type: 'ENTM(P)', title: "Progress Is the Product", color: 'a' },
    { type: 'ISTM(P)', title: "Just Do It", color: 'a' },
    { type: 'ISFM(P)', title: "Action Speaks Louder Than Words", color: 'b' },
    { type: 'INFM(P)', title: "Making Life Kinder and Gentler", color: 'a' },
    { type: 'INTM(P)', title: "Life's Problem Solvers", color: 'b' },
    { type: 'ESTC(J)', title: "Life's Natural Administrators", color: 'b' },
    { type: 'ESFC(J)', title: "Everyone's Trusted Friend", color: 'a' },
    { type: 'ENFC(J)', title: "Smooth-Talking Persuaders", color: 'b' },
    { type: 'ENTC(J)', title: "Life's Natural Leaders", color: 'a' },
];

const chartDescriptions: any = {
    'E': { question: "Where do I get my energy from? How do I relate to the outer world?", answer: "I mainly direct my energy towards the outer world of people and things. I tend to act first and reflect later. Interaction stimulates me, and I often feel energized after being active and social." },
    'I': { question: "Where do I get my energy from? How do I relate to the outer world?", answer: "I mainly direct my energy towards the inner world of experiences and ideas. I tend to reflect first and act later. I value privacy and often need time alone to recharge after social interaction." },
    'S': { question: "How do I take in Information? Find out about things?", answer: "I focus on what is real and actual. I value practical application and trust information that I can confirm with my five senses. I pay attention to details and the present moment." },
    'N': { question: "How do I take in Information? Find out about things?", answer: "I focus on patterns and meanings. I value imagination and inspiration, trusting my intuition and hunches. I am often more interested in future possibilities and the 'big picture' than specific details." },
    'T': { question: "How do I make decisions?", answer: "I prefer to make decisions based on logic and objective analysis. I search for the truth and principles that apply in a given situation. I strive to be impartial and value consistency." },
    'F': { question: "How do I make decisions?", answer: "I prefer to make decisions based on values and subjective evaluation. I am concerned with harmony and how the decision will affect the people involved. I strive to be compassionate and empathetic." },
    'J': { question: "How do I organise my outer world?", answer: "I prefer a planned and organized approach to life. I like to have things settled and decided. I enjoy making lists, schedules, and bringing closure to tasks." },
    'P': { question: "How do I organise my outer world?", answer: "I prefer a flexible and spontaneous approach to life. I like to keep my options open and adapt to new information as it arises. I feel comfortable going with the flow." }
};

const wordMap: Record<string, string> = {
    'E': 'Extroverted', 'I': 'Introverted',
    'S': 'Sensate', 'N': 'iNtuitive',
    'T': 'Thinking', 'F': 'Feeling',
    'J': 'Considered', 'P': 'iMpromptu'
};

const rgbaColorMap: any = {
    'E': { bg: 'rgba(234, 228, 0, 0.9)', border: 'rgba(234, 228, 0, 1)' },
    'I': { bg: 'rgba(68, 179, 225, 0.9)', border: 'rgba(68, 179, 225, 1)' },
    'S': { bg: 'rgba(255, 153, 0, 0.9)', border: 'rgba(255, 153, 0, 1)' },
    'N': { bg: 'rgba(120, 33, 112, 0.9)', border: 'rgba(120, 33, 112, 1)' },
    'T': { bg: 'rgba(33, 92, 152, 0.9)', border: 'rgba(33, 92, 152, 1)' },
    'F': { bg: 'rgba(78, 167, 46, 0.9)', border: 'rgba(78, 167, 46, 1)' },
    'J': { bg: 'rgba(235, 21, 21, 0.9)', border: 'rgba(235, 21, 21, 1)' },
    'P': { bg: 'rgba(153, 102, 51, 0.9)', border: 'rgba(153, 102, 51, 1)' }
};

const formatLetter = (letter: string) => {
    if (letter === 'J') return 'C(J)';
    if (letter === 'P') return 'M(P)';
    return letter;
};

const formatTypeString = (type: string) => {
    return type
        .replace('J', 'C<span class="suffix">(J)</span>')
        .replace('P', 'M<span class="suffix">(P)</span>');
};

const formatTypeKey = (str: string) => {
    return str.replace('J', 'C(J)').replace('P', 'M(P)');
};

const App: React.FC = () => {
    const [stage, setStage] = useState<'cover' | 'quiz' | 'results'>('cover');
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState<(string | null)[]>(new Array(questions.length).fill(null));
    const [isAdvancing, setIsAdvancing] = useState(false);
    const [showConverse, setShowConverse] = useState(false);
    const [modalData, setModalData] = useState<{title: string, subtitle: string, desc: string} | null>(null);

    // Results state
    const [finalData, setFinalData] = useState<any[]>([]);
    const [otherLetters, setOtherLetters] = useState<string[]>([]);
    const [typeString, setTypeString] = useState('');
    const [scoresState, setScoresState] = useState<any>({});
    const [maxScoresState, setMaxScoresState] = useState<any>({});

    const handleStart = () => {
        setStage('quiz');
    };

    const handleOptionClick = (val: string) => {
        if (isAdvancing) return;
        setIsAdvancing(true);
        const newAnswers = [...answers];
        newAnswers[qIndex] = val;
        setAnswers(newAnswers);

        setTimeout(() => {
            if (qIndex < questions.length - 1) {
                setQIndex(qIndex + 1);
            } else {
                // If last question, just stay to allow finish
            }
            setIsAdvancing(false);
        }, 200);
    };

    const handlePrev = () => {
        if (qIndex > 0) setQIndex(qIndex - 1);
    };

    const handleRandomDev = () => {
        const randomAnswers = questions.map(q => {
            const parts = q.type.split('/');
            return Math.random() < 0.5 ? parts[0] : parts[1];
        });
        setAnswers(randomAnswers);
        calculateResults(randomAnswers);
    };

    const handleFinish = () => {
        calculateResults(answers);
    };

    const calculateResults = (currentAnswers: (string | null)[]) => {
        const scores: any = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        currentAnswers.forEach(a => { if (a) scores[a]++; });
        scores.E *= 2; scores.I *= 2;
        
        const maxScores: any = { E: 22, I: 22, S: 23, N: 23, T: 23, F: 23, J: 23, P: 23 };
        const getPercent = (l: string) => (Math.min(scores[l], 20) / maxScores[l]) * 100;

        const fData = [];
        const oLetters = [];

        if (scores.E >= scores.I) { fData.push({ letter: 'E', score: getPercent('E') }); oLetters.push('I'); }
        else { fData.push({ letter: 'I', score: getPercent('I') }); oLetters.push('E'); }

        if (scores.S >= scores.N) { fData.push({ letter: 'S', score: getPercent('S') }); oLetters.push('N'); }
        else { fData.push({ letter: 'N', score: getPercent('N') }); oLetters.push('S'); }

        if (scores.T >= scores.F) { fData.push({ letter: 'T', score: getPercent('T') }); oLetters.push('F'); }
        else { fData.push({ letter: 'F', score: getPercent('F') }); oLetters.push('T'); }

        if (scores.J >= scores.P) { fData.push({ letter: 'J', score: getPercent('J') }); oLetters.push('P'); }
        else { fData.push({ letter: 'P', score: getPercent('P') }); oLetters.push('J'); }

        setFinalData(fData);
        setOtherLetters(oLetters);
        setTypeString(fData.map(d => d.letter).join(''));
        setScoresState(scores);
        setMaxScoresState(maxScores);
        setStage('results');
    };

    const renderCharts = () => {
        if (stage !== 'results') return;
        
        // Main Chart
        const svg = d3.select("#mainResultsChart");
        svg.html("");
        const margin = { top: 40, right: 20, bottom: 50, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
        
        const x = d3.scaleBand().domain(finalData.map(d => d.letter)).range([0, width]).padding(0.4);
        const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
        const d3ColorMap: any = { 'E': '#eae400', 'I': '#44b3e1', 'S': '#ff9900', 'N': '#782170', 'T': '#215c98', 'F': '#4ea72e', 'J': '#eb1515', 'P': '#996633' };

        g.append("g").attr("class", "grid").call(d3.axisLeft(y).tickSize(-width).tickFormat(() => "").tickValues([0, 100])).call(sel => sel.select(".domain").remove()).selectAll(".tick line").attr("stroke", "#ccc");
        
        g.append("g").attr("class", "axis").attr("transform", `translate(0,${height})`)
         .call(d3.axisBottom(x).tickSize(0).tickPadding(10).tickFormat(d => d === 'J' ? 'C(J)' : d === 'P' ? 'M(P)' : d))
         .call(sel => sel.select(".domain").remove())
         .selectAll("text").attr("font-family", "Poppins").style("font-size", "28px").attr("font-weight", "600").attr("fill", "#2c3e50");

        const bars = g.selectAll(".bar-group").data(finalData).join("g").attr("transform", d => `translate(${x(d.letter)}, 0)`);
        
        bars.append("rect").attr("class", "chart-bar-rect").attr("x", 0).attr("y", d => y(d.score)).attr("width", x.bandwidth()).attr("height", d => height - y(d.score)).attr("fill", d => d3ColorMap[d.letter]).attr("rx", 5)
            .on("click", (e, d) => showBubbleInfo(d.letter));

        const bubbles = bars.append("g").attr("class", "chart-bubble-group").attr("transform", d => `translate(${x.bandwidth()! / 2}, ${y(d.score) - 25})`)
            .on("click", (e, d) => showBubbleInfo(d.letter));
        
        bubbles.append("circle").attr("r", 15).attr("fill", "#fff").attr("stroke", d => d3ColorMap[d.letter]).attr("stroke-width", 2);
        bubbles.append("text").text("?").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("fill", "#555").style("font-family", "Poppins").style("font-size", "18px").style("font-weight", "700").style("pointer-events", "none");

        // Converse Chart
        if (!showConverse) return;
        const cvSvg = d3.select("#converseResultsChart");
        cvSvg.html("");
        const cvWidth = 960 - margin.left - margin.right;
        const cvHeight = 500 - margin.top - margin.bottom;
        const cvG = cvSvg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
        
        const getD3Percent = (l: string, opp: string) => {
            const real = scoresState[l];
            const max = maxScoresState[l];
            const oppReal = scoresState[opp];
            if (real > 20) return (20 / max) * 100;
            if (oppReal > 20) return ((max - 20) / max) * 100;
            return (real / max) * 100;
        };

        const cvData = [
            { group: 'E / I', valueA: getD3Percent('E', 'I'), valueB: getD3Percent('I', 'E'), keyA: 'E', keyB: 'I' },
            { group: 'S / N', valueA: getD3Percent('S', 'N'), valueB: getD3Percent('N', 'S'), keyA: 'S', keyB: 'N' },
            { group: 'T / F', valueA: getD3Percent('T', 'F'), valueB: getD3Percent('F', 'T'), keyA: 'T', keyB: 'F' },
            { group: 'C(J) / M(P)', valueA: getD3Percent('J', 'P'), valueB: getD3Percent('P', 'J'), keyA: 'J', keyB: 'P' }
        ];

        const x0 = d3.scaleBand().domain(cvData.map(d => d.group)).rangeRound([0, cvWidth]).padding(0.2);
        const x1 = d3.scaleBand().domain(['valueA', 'valueB']).rangeRound([0, x0.bandwidth()]).padding(0);
        const yCv = d3.scaleLinear().domain([0, 100]).nice().rangeRound([cvHeight, 0]);

        cvG.append("g").attr("class", "grid").call(d3.axisLeft(yCv).tickSize(-cvWidth).tickFormat(() => "").tickValues([0, 100]))
           .call(sel => sel.select(".domain").remove()).call(sel => sel.selectAll(".tick line").attr("stroke", d => d === 100 ? '#2c3e50' : '#ccc'));
        
        cvG.append("line").attr("x1", x0(cvData[0].group)! - 10).attr("y1", yCv(50)).attr("x2", x0(cvData[3].group)! + x0.bandwidth() + 10).attr("y2", yCv(50)).attr("stroke", "#333").attr("stroke-width", 2).attr("stroke-dasharray", "6,4");

        cvG.append("g").attr("class", "axis").attr("transform", `translate(0,${cvHeight})`)
           .call(d3.axisBottom(x0).tickSize(0).tickPadding(10)).call(sel => sel.select(".domain").remove())
           .selectAll("text").attr("font-family", "Poppins").style("font-size", "28px").attr("font-weight", "600").attr("fill", "#2c3e50");

        const cvBars = cvG.selectAll("g.layer").data(cvData).join("g").attr("transform", d => `translate(${x0(d.group)},0)`)
           .selectAll("rect").data(d => [{key:'valueA', val: d.valueA, l: d.keyA}, {key:'valueB', val: d.valueB, l: d.keyB}]).join("g");
        
        cvBars.append("rect").attr("class", "chart-bar-rect").attr("x", d => x1(d.key)!).attr("width", x1.bandwidth()).attr("y", d => yCv(d.val)).attr("height", d => cvHeight - yCv(d.val)).attr("fill", d => d3ColorMap[d.l]).attr("rx", 5)
            .on("click", (e, d) => showBubbleInfo(d.l));

        const cvBubbles = cvBars.append("g").attr("class", "chart-bubble-group").attr("transform", d => `translate(${x1(d.key)! + x1.bandwidth()/2}, ${yCv(d.val) - 25})`)
            .on("click", (e, d) => showBubbleInfo(d.l));
        
        cvBubbles.append("circle").attr("r", 15).attr("fill", "#fff").attr("stroke", d => d3ColorMap[d.l]).attr("stroke-width", 2);
        cvBubbles.append("text").text("?").attr("text-anchor", "middle").attr("dominant-baseline", "central").attr("fill", "#555").style("font-family", "Poppins").style("font-size", "18px").style("font-weight", "700").style("pointer-events", "none");
    };

    useEffect(() => { renderCharts(); }, [finalData, showConverse, stage]);

    const showBubbleInfo = (letter: string) => {
        const info = chartDescriptions[letter];
        let title = letter;
        if(letter === 'J') title = 'C<span class="suffix">(J)</span>';
        if(letter === 'P') title = 'M<span class="suffix">(P)</span>';
        setModalData({ title, subtitle: info.question, desc: info.answer });
    };

    const showProfileModal = (type: string, title: string) => {
        let displayType = type.replace('J', 'C<span class="suffix">(J)</span>').replace('P', 'M<span class="suffix">(P)</span>');
        // Use the raw key for lookup
        const desc = personalityDescriptions[type] || "Description unavailable.";
        setModalData({ title: displayType, subtitle: title, desc });
    };

    return (
        <div className="container">
            {stage === 'cover' && (
                <div id="coverPage">
                    <h1 id="coverTitle" className="cover-title">The <b>J16T</b> Questionnaire<br/>(Jung 16 Temperaments)</h1>
                    <p className="cover-copyright">exclusive to <b>ourfields.ie</b> programmes</p>
                    <p className="cover-description">This is a instrument that describes a person's personal style, their own unique way of viewing, responding and relating to the world around them.</p>
                    <p className="cover-description-sub">It can be used for:</p>
                    <div className="features-list">
                         <div className="feature-item"><img src="conflict.png" alt="Icon" className="feature-icon" onError={(e) => (e.target as HTMLImageElement).src='https://placehold.co/100x100/6a11cb/ffffff?text=Icon'} /><div className="feature-text-content"><h4 className="feature-title">Improving Communications</h4><p className="feature-description">The test helps build self-esteem and manage conflict by focusing on the positive contributions of each personality type.</p></div></div>
                         <div className="feature-item"><img src="podium.png" alt="Icon" className="feature-icon" onError={(e) => (e.target as HTMLImageElement).src='https://placehold.co/100x100/2575fc/ffffff?text=Icon'} /><div className="feature-text-content"><h4 className="feature-title">Develop Individual Success</h4><p className="feature-description">The test provides practical insight into what motivates and de-motivates an individual.</p></div></div>
                         <div className="feature-item"><img src="self.png" alt="Icon" className="feature-icon" onError={(e) => (e.target as HTMLImageElement).src='https://placehold.co/100x100/6a11cb/ffffff?text=Icon'} /><div className="feature-text-content"><h4 className="feature-title">Better Self-Understanding</h4><p className="feature-description">The test helps individuals get to know themselves better, which is a source of great satisfaction.</p></div></div>
                         <div className="feature-item"><img src="career.png" alt="Icon" className="feature-icon" onError={(e) => (e.target as HTMLImageElement).src='https://placehold.co/100x100/2575fc/ffffff?text=Icon'} /><div className="feature-text-content"><h4 className="feature-title">Career Guidance</h4><p className="feature-description">Self-awareness is the key to good career guidance, as personal style affects motivation.</p></div></div>
                    </div>
                    <button id="startBtn" onClick={handleStart}>Begin the Evaluation</button>
                    <p className="ourfields-copyright-bottom">ourfields.ie ©</p>
                </div>
            )}

            {stage === 'quiz' && (
                <div id="quizSection">
                    <h1>JUNG TYPOLOGY</h1>
                    <div id="questionnaire">
                        <div className={`question-container ${isAdvancing ? 'transitioning' : ''}`} id="q-container" style={{opacity: 1, transform: 'translateY(0)'}}>
                            <div className="question-number">{qIndex + 1}</div>
                            <div className="question-text">{questions[qIndex].text}</div>
                            <div className="options-container">
                                {questions[qIndex].options.map((opt, i) => {
                                    const val = questions[qIndex].type.split('/')[i];
                                    const isSelected = answers[qIndex] === val;
                                    return (
                                        <div key={i} className={`option ${isSelected ? 'selected' : ''}`} onClick={() => handleOptionClick(val)}>
                                            <input type="radio" checked={isSelected} readOnly />
                                            <label>{opt}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="dev-navigation" style={{textAlign: 'right', marginBottom: '10px', marginTop: '15px'}}>
                        <button id="randomBtn" style={{background: '#f39c12'}} onClick={handleRandomDev}>Dev: Random Results</button>
                    </div>
                    <div className="navigation">
                        <button id="prevBtn" disabled={qIndex === 0} onClick={handlePrev}>Previous</button>
                        {qIndex === questions.length - 1 && (
                            <button id="finishBtn" disabled={answers.some(a => a === null)} onClick={handleFinish}>Finish</button>
                        )}
                    </div>
                    <footer className="page-footer"><b>ourfields.ie</b> J16T (Jung 16 Temperaments)</footer>
                </div>
            )}

            {stage === 'results' && (
                <div id="resultsPage">
                    <div id="print-page-1">
                        <h1>Your Results</h1>
                        <div className="chart-container">
                            <svg id="mainResultsChart" viewBox="0 0 600 400"></svg>
                        </div>
                        <div className="personality-type-display" dangerouslySetInnerHTML={{__html: formatTypeString(typeString)}} />
                        <div className="result-section-static">
                            <div className="personality-words-display" dangerouslySetInnerHTML={{__html: finalData.map(d => {
                                const full = wordMap[d.letter];
                                if(d.letter === 'J') return '<strong>C</strong>onsidered<span class="suffix">(judging)</span>';
                                if(d.letter === 'P') return 'i<strong>M</strong>promptu<span class="suffix">(perceiving)</span>';
                                return full.replace(d.letter, `<strong>${d.letter}</strong>`);
                            }).join(' - ')}} />
                            <p id="desc-overview" className="result-section-content">{personalityDescriptions[formatTypeKey(typeString)] || "Description not available."}</p>
                        </div>
                    </div>
                    
                    <div className="letter-definitions-grid" style={{display: finalData.length === 4 ? 'grid' : 'none'}}>
                         {finalData.map((d, i) => (
                             <details key={i} className="letter-card" style={{
                                 borderColor: rgbaColorMap[d.letter].border,
                                 backgroundColor: rgbaColorMap[d.letter].bg.replace(', 0.9)', ', 0.1)')
                             }}>
                                 <summary className="letter-card-title" dangerouslySetInnerHTML={{__html: (wordMap[d.letter] + (d.letter==='J'?'<span class="suffix">(judging)</span>':d.letter==='P'?'<span class="suffix">(perceiving)</span>':''))}} />
                                 <p className="letter-card-desc">{letterDescriptions[d.letter]}</p>
                             </details>
                         ))}
                    </div>

                    <div className="results-details">
                        <div className="toggle-other-container">
                            <button className="other-toggle-btn" onClick={() => setShowConverse(!showConverse)}>
                                {showConverse ? 'Hide Converse Profile' : 'Show Converse Profile'}
                            </button>
                        </div>
                        {showConverse && (
                            <>
                                <div className="chart-container" id="converse-chart-container">
                                    <svg id="converseResultsChart" viewBox="0 0 960 500"></svg>
                                </div>
                                <h3 className="opposite-type-header" dangerouslySetInnerHTML={{__html: `Your converse profile: ${formatTypeString(otherLetters.join(''))}`}} />
                                <p className="result-section-content" style={{fontStyle: 'italic'}}>{personalityDescriptions[formatTypeKey(otherLetters.join(''))] || "Description not available."}</p>
                                <div className="letter-definitions-grid" style={{display: 'grid'}}>
                                    {otherLetters.map((l, i) => (
                                        <details key={i} className="letter-card" style={{
                                            borderColor: rgbaColorMap[l].border,
                                            backgroundColor: rgbaColorMap[l].bg.replace(', 0.9)', ', 0.1)')
                                        }}>
                                            <summary className="letter-card-title" dangerouslySetInnerHTML={{__html: (wordMap[l] + (l==='J'?'<span class="suffix">(judging)</span>':l==='P'?'<span class="suffix">(perceiving)</span>':''))}} />
                                            <p className="letter-card-desc">{letterDescriptions[l]}</p>
                                        </details>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="results-details">
                        <div className="profile-grid-container">
                            <h3 className="profile-grid-title">Discover Jung's 16 Profiles</h3>
                            <div className="profile-grid">
                                {profileGridData.map((p, i) => (
                                    <div key={i} className={`profile-cell ${p.color === 'a' ? 'cell-color-a' : 'cell-color-b'} ${p.type === formatTypeKey(typeString) ? 'highlight' : ''}`} onClick={() => showProfileModal(p.type, p.title)}>
                                        <div className="profile-cell-type" dangerouslySetInnerHTML={{__html: p.type.replace('C(J)', 'C<span class="suffix">(J)</span>').replace('M(P)', 'M<span class="suffix">(P)</span>')}} />
                                        <div className="profile-cell-title">{p.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="restart-button-container">
                        <button id="printBtn" onClick={() => {
                            setShowConverse(true);
                            setTimeout(() => window.print(), 300);
                        }}>Download / Print Results</button>
                    </div>
                    <footer className="page-footer"><b>ourfields.ie</b> J16T (Jung 16 Temperaments)</footer>
                </div>
            )}

            {modalData && (
                <div id="profileModal" className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalData(null)}>
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setModalData(null)}>&times;</button>
                        <h4 className="modal-profile-title" dangerouslySetInnerHTML={{__html: modalData.title}} />
                        <p className="modal-profile-subtitle">{modalData.subtitle}</p>
                        <p className="modal-profile-description">{modalData.desc}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;