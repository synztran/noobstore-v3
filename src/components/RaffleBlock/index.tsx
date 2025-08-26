import { BellAlertIcon, ClockIcon, UsersIcon } from "@heroicons/react/20/solid";
import {
	Badge,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Input,
	TextareaAutosize,
} from "@material-ui/core";
import Check from "@mui/icons-material/Check";
import { useEffect, useState } from "react";

export default function EnhancedRaffleSystem() {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [isRaffleOpen, setIsRaffleOpen] = useState(false);
	const [showRaffleModal, setShowRaffleModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [participants, setParticipants] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			const now = new Date();
			const raffleDate = new Date("2023-09-13T00:00:00"); // Set your raffle date here
			const difference = raffleDate.getTime() - now.getTime();

			if (difference > 0) {
				setTimeLeft({
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				});
			} else {
				clearInterval(timer);
				setIsRaffleOpen(true);
			}
		}, 1000);

		// Simulate increasing participants
		const participantTimer = setInterval(() => {
			setParticipants((prev) =>
				Math.min(prev + Math.floor(Math.random() * 3), 1000)
			);
		}, 5000);

		return () => {
			clearInterval(timer);
			clearInterval(participantTimer);
		};
	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Here you would typically send the form data to your server
		setShowRaffleModal(false);
		setShowSuccessModal(true);
		setParticipants((prev) => prev + 1);
	};

	return (
		<div className="max-w-6xl mx-auto p-4">
			<div className="grid md:grid-cols-2 gap-8">
				<div className="relative overflow-hidden rounded-lg shadow-lg group">
					<div className="relative w-full h-0 pb-[100%] overflow-hidden">
						<img
							src="/placeholder.svg?height=400&width=400"
							alt="Product Image"
							className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
						/>
					</div>
					<Badge className="absolute top-4 right-4 text-lg font-bold z-10 rounded-none border-none bg-primary text-primary-foreground px-3 py-1.5 transition-all duration-300 group-hover:shadow-glow">
						Limited Edition
					</Badge>
					<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
						<div className="flex items-center justify-center text-2xl font-bold">
							<ClockIcon className="mr-2" />
							{timeLeft.days}d {timeLeft.hours}h{" "}
							{timeLeft.minutes}m {timeLeft.seconds}s
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-between">
					<div>
						<h2 className="text-4xl font-bold mb-2">
							Quantum X Pro
						</h2>
						<div className="text-3xl font-bold text-primary mb-4">
							$999.99
						</div>
						<p className="text-lg mb-6">
							Experience the future with Quantum X Pro. This
							revolutionary device combines cutting-edge
							technology with sleek design, offering unparalleled
							performance and style.
						</p>
						<ul className="space-y-2 mb-6">
							<li className="flex items-center">
								<Check className="mr-2 text-green-500" />{" "}
								AI-powered personal assistant
							</li>
							<li className="flex items-center">
								<Check className="mr-2 text-green-500" />{" "}
								Holographic display
							</li>
							<li className="flex items-center">
								<Check className="mr-2 text-green-500" />{" "}
								Quantum computing core
							</li>
							<li className="flex items-center">
								<Check className="mr-2 text-green-500" />{" "}
								Eco-friendly, sustainable materials
							</li>
						</ul>
					</div>
					<div>
						<div className="flex items-center mb-4">
							<UsersIcon className="mr-2" />
							<span className="font-semibold">
								{participants} people have entered the raffle!
							</span>
						</div>
						{isRaffleOpen ? (
							<Button
								onClick={() => setShowRaffleModal(true)}
								className="w-full animate-pulse">
								Join Raffle Now!
							</Button>
						) : (
							<div className="flex items-center text-yellow-500">
								<BellAlertIcon className="mr-2" />
								<span>Raffle opens soon. Be ready!</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<Dialog
				open={showRaffleModal}
				onChange={(e) => setShowRaffleModal(!showRaffleModal)}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogTitle>
						Enter the Exclusive Raffle You're one step away from the
						chance to own the revolutionary Quantum X Pro!
					</DialogTitle>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="name">Name</label>
							<Input
								id="name"
								name="name"
								placeholder="Your full name"
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="email">Email</label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Your email address"
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="phone">Phone</label>
							<Input
								id="phone"
								name="phone"
								type="tel"
								placeholder="Your phone number"
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="address">Address</label>
							<TextareaAutosize
								id="address"
								name="address"
								placeholder="Your full address"
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="funQuestion">
								Why do you want the Quantum X Pro?
							</label>
							<TextareaAutosize
								id="funQuestion"
								name="funQuestion"
								placeholder="Tell us why you're excited about the Quantum X Pro!"
							/>
						</div>
						<DialogActions>
							<Button type="submit" className="w-full">
								Submit Entry
							</Button>
						</DialogActions>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={showSuccessModal}
				onChange={(e) => setShowSuccessModal(!showSuccessModal)}>
				<DialogContent>
					<DialogTitle>
						Congratulations! Your raffle entry has been submitted.
						You're now in the running to be one of the first to own
						the revolutionary Quantum X Pro!
					</DialogTitle>
					<p className="text-center text-lg font-semibold mt-4">
						Good luck!
					</p>
					<Button onClick={() => setShowSuccessModal(false)}>
						Close
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
